import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, PhoneOff, Video, VideoOff, Users } from "lucide-react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

import { useAuth } from "../../hooks/useAuth";

type PeerJoinedPayload = {
  socketId: string;
  userId: number | string;
};

type OfferPayload = {
  socketId: string;
  offer: RTCSessionDescriptionInit;
};

type AnswerPayload = {
  socketId: string;
  answer: RTCSessionDescriptionInit;
};

type IceCandidatePayload = {
  socketId: string;
  candidate: RTCIceCandidateInit;
};

type UserLeftPayload = {
  socketId: string;
};

type VideoTileProps = {
  stream: MediaStream | null;
  title: string;
  placeholder: string;
  muted?: boolean;
};

const peerConnectionConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const getSocketServerUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  return apiBaseUrl.replace(/\/api\/?$/, "");
};

function VideoTile({ stream, title, placeholder, muted = false }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.srcObject = stream;
    }

    return () => {
      if (video) {
        video.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <div className="relative min-h-64 overflow-hidden rounded-lg bg-slate-950 shadow-sm">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          playsInline
          className="h-full min-h-64 w-full object-cover"
        />
      ) : (
        <div className="flex min-h-64 items-center justify-center px-6 text-center text-sm text-slate-300">
          {placeholder}
        </div>
      )}

      <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1 text-sm font-medium text-white">
        {title}
      </div>
    </div>
  );
}

export default function VideoRoom() {
  const { id, sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const roomTargetId = sessionId ?? id ?? "";
  const roomType = sessionId ? "session" : "group";
  const roomId = `${roomType}-${roomTargetId}`;
  const backPath = sessionId
    ? "/sessions"
    : roomTargetId
      ? `/groups/${roomTargetId}`
      : "/groups";
  const backLabel = sessionId ? "Retour aux sessions" : "Retour au groupe";
  const pageTitle = sessionId ? "Visio de la session" : "Visio du groupe";
  const statusTargetLabel = sessionId ? "la session" : "ce groupe";
  const shareTargetLabel = sessionId ? "la session" : "le groupe";
  const socketUrl = getSocketServerUrl();

  const localStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>(
    {},
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Preparation de la visio...");
  const [mediaError, setMediaError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const peerConnections: Record<string, RTCPeerConnection> = {};

    const removePeer = (socketId: string) => {
      peerConnections[socketId]?.close();
      delete peerConnections[socketId];

      setRemoteStreams((currentStreams) => {
        const nextStreams = { ...currentStreams };
        delete nextStreams[socketId];
        return nextStreams;
      });
    };

    const startVideoRoom = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);
        setMediaError("");
        setStatusMessage("Connexion a la room...");

        const socket = io(socketUrl, {
          autoConnect: false,
          transports: ["websocket", "polling"],
        });

        socketRef.current = socket;

        const createPeerConnection = (socketId: string) => {
          if (peerConnections[socketId]) {
            return peerConnections[socketId];
          }

          const peerConnection = new RTCPeerConnection(peerConnectionConfig);
          peerConnections[socketId] = peerConnection;

          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });

          peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;

            if (remoteStream) {
              setRemoteStreams((currentStreams) => ({
                ...currentStreams,
                [socketId]: remoteStream,
              }));
            }
          };

          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("ice-candidate", {
                target: socketId,
                candidate: event.candidate.toJSON(),
              });
            }
          };

          peerConnection.onconnectionstatechange = () => {
            if (
              peerConnection.connectionState === "failed" ||
              peerConnection.connectionState === "disconnected" ||
              peerConnection.connectionState === "closed"
            ) {
              removePeer(socketId);
            }
          };

          return peerConnection;
        };

        const handleUserJoined = async ({ socketId }: PeerJoinedPayload) => {
          if (socketId === socket.id) {
            return;
          }

          const peerConnection = createPeerConnection(socketId);
          const offer = await peerConnection.createOffer();

          await peerConnection.setLocalDescription(offer);

          socket.emit("offer", {
            target: socketId,
            offer,
          });
        };

        const handleOffer = async ({ socketId, offer }: OfferPayload) => {
          const peerConnection = createPeerConnection(socketId);

          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer),
          );

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          socket.emit("answer", {
            target: socketId,
            answer,
          });
        };

        const handleAnswer = async ({ socketId, answer }: AnswerPayload) => {
          const peerConnection = peerConnections[socketId];

          if (peerConnection) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(answer),
            );
          }
        };

        const handleIceCandidate = async ({
          socketId,
          candidate,
        }: IceCandidatePayload) => {
          const peerConnection = peerConnections[socketId];

          if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        };

        socket.on("connect", () => {
          setIsConnected(true);
          setStatusMessage(`Connecte a la visio de ${statusTargetLabel}.`);
          socket.emit("join-room", {
            roomId,
            userId: user?.id ?? socket.id,
          });
        });

        socket.on("disconnect", () => {
          setIsConnected(false);
          setStatusMessage("Connexion visio interrompue.");
        });

        socket.on("connect_error", (error) => {
          setIsConnected(false);
          setStatusMessage(`Erreur socket: ${error.message}`);
        });

        socket.on("user-joined", (payload: PeerJoinedPayload) => {
          void handleUserJoined(payload);
        });

        socket.on("offer", (payload: OfferPayload) => {
          void handleOffer(payload);
        });

        socket.on("answer", (payload: AnswerPayload) => {
          void handleAnswer(payload);
        });

        socket.on("ice-candidate", (payload: IceCandidatePayload) => {
          void handleIceCandidate(payload);
        });

        socket.on("user-left", ({ socketId }: UserLeftPayload) => {
          removePeer(socketId);
        });

        socket.connect();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Impossible d'acceder a la camera ou au micro.";

        setMediaError(message);
        setStatusMessage("La visio n'a pas pu demarrer.");
      }
    };

    void startVideoRoom();

    return () => {
      isMounted = false;

      socketRef.current?.disconnect();
      socketRef.current = null;

      Object.values(peerConnections).forEach((peerConnection) => {
        peerConnection.close();
      });

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setRemoteStreams({});
    };
  }, [roomId, socketUrl, statusTargetLabel, user?.id]);

  const remoteEntries = Object.entries(remoteStreams);

  const toggleMicrophone = () => {
    setIsMicEnabled((currentValue) => {
      const nextValue = !currentValue;

      localStreamRef.current?.getAudioTracks().forEach((track) => {
        track.enabled = nextValue;
      });

      return nextValue;
    });
  };

  const toggleCamera = () => {
    setIsCameraEnabled((currentValue) => {
      const nextValue = !currentValue;

      localStreamRef.current?.getVideoTracks().forEach((track) => {
        track.enabled = nextValue;
      });

      return nextValue;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to={backPath} className="text-sm font-medium text-blue-600">
            {backLabel}
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {pageTitle}
          </h1>

          <p className="mt-1 text-sm text-slate-600">{statusMessage}</p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isConnected ? "bg-green-500" : "bg-slate-300"
            }`}
          />
          {isConnected ? "En ligne" : "Hors ligne"}
        </div>
      </div>

      {mediaError && (
        <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700">
          {mediaError}
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-4">
          {remoteEntries.length > 0 ? (
            <div
              className={`grid gap-4 ${
                remoteEntries.length > 1 ? "lg:grid-cols-2" : ""
              }`}
            >
              {remoteEntries.map(([socketId, stream], index) => (
                <VideoTile
                  key={socketId}
                  stream={stream}
                  title={`Participant ${index + 1}`}
                  placeholder="En attente du flux distant..."
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <div>
                <Users className="mx-auto h-10 w-10 text-slate-400" />
                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  En attente d'un participant
                </h2>
                <p className="mt-1 max-w-sm text-sm text-slate-600">
                  Partage cette room depuis {shareTargetLabel} pour lancer la
                  visio a plusieurs.
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <VideoTile
            stream={localStream}
            title="Vous"
            placeholder="Activation de votre camera..."
            muted
          />

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={toggleMicrophone}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                title={isMicEnabled ? "Couper le micro" : "Activer le micro"}
              >
                {isMicEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                title={
                  isCameraEnabled ? "Couper la camera" : "Activer la camera"
                }
              >
                {isCameraEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(backPath)}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-red-600 text-white transition-colors hover:bg-red-700"
                title="Quitter la visio"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
