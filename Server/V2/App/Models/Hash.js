import  crypto from 'crypto';

class Hash {
  static generateHash(content) {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
  }
}

export default Hash