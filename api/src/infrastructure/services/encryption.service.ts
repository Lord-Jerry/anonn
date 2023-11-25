import * as crypto from 'crypto';
import { Injectable, Logger } from '@nestjs/common';

import { ENVIRONMENTAL_VARIABLES } from '../constants';
import { ConfigMangerService } from '../config/config.service';

type Props = {
  text: string;
  key: `${string}-${string}`;
  algorithm: string;
};

@Injectable()
export class EncryptionService {
  private readonly algorithm;
  private readonly generalEncryptionKey;
  private readonly logger = new Logger(EncryptionService.name);

  constructor(private config: ConfigMangerService) {
    this.algorithm = this.config.get(ENVIRONMENTAL_VARIABLES.ENCRYPTION_ALGORITHM);
    this.generalEncryptionKey = this.config.get(ENVIRONMENTAL_VARIABLES.ENCRYPTION_KEY);
  }

  generateEncryptionKey(): `${string}-${string}` {
    const key = crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16).toString('hex');
    return `${key}-${iv}`;
  }

  encrypt({ text, key, algorithm }: Props): string {
    const [keyString, ivString] = key.split('-');

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(keyString, 'hex'), Buffer.from(ivString, 'hex'));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  decrypt({ text, key, algorithm }: Props): string {
    try {
      const [keyString, ivString] = key.split('-');

      const decipher = crypto.createDecipheriv(algorithm, Buffer.from(keyString, 'hex'), Buffer.from(ivString, 'hex'));
      let decrypted = decipher.update(text, 'hex');
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (e) {
      this.logger.error(e);
      this.logger.error('failed to decrypt message');
      return text;
    }
  }

  encryptMessage(text: string, conversationEncyptionKey: `${string}-${string}`): string {
    const messageEncryptedWithGeneralKey = this.encrypt({
      text,
      key: this.generalEncryptionKey,
      algorithm: this.algorithm,
    });

    return this.encrypt({
      text: messageEncryptedWithGeneralKey,
      key: conversationEncyptionKey,
      algorithm: this.algorithm,
    });
  }

  decryptMessage(text: string, conversationEncyptionKey: `${string}-${string}`): string {
    const messageEncryptedWithConversationKey = this.decrypt({
      text,
      key: conversationEncyptionKey,
      algorithm: this.algorithm,
    });

    return this.decrypt({
      text: messageEncryptedWithConversationKey,
      key: this.generalEncryptionKey,
      algorithm: this.algorithm,
    });
  }
}
