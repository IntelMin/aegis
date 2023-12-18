
import crypto from 'crypto';
export default function hashString(input:string) {
    // Choose the hashing algorithm (e.g., 'sha256', 'md5', 'sha512', etc.)
    const algorithm = 'sha256';
  
    // Create a hash object
    const hash = crypto.createHash(algorithm);
  
    // Update the hash object with the input string
    hash.update(input);
  
    // Get the hexadecimal representation of the hash
    const hashedString = hash.digest('hex');
  
    return hashedString;
  }