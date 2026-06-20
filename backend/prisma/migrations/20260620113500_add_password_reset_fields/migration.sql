ALTER TABLE `users`
  ADD COLUMN `passwordResetToken` VARCHAR(255) NULL,
  ADD COLUMN `passwordResetExpires` DATETIME(3) NULL;

CREATE INDEX `users_passwordResetToken_idx` ON `users`(`passwordResetToken`);
