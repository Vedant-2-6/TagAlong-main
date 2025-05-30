const crypto = require('crypto');

// Environment variables for encryption (should be in .env file)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here'; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16 bytes

// Ensure key is exactly 32 bytes by either truncating or hashing
const getKey = () => {
  // If key is exactly 32 bytes, use it directly
  if (Buffer.from(ENCRYPTION_KEY).length === 32) {
    return Buffer.from(ENCRYPTION_KEY);
  }
  
  // If key is longer, truncate it to 32 bytes
  if (Buffer.from(ENCRYPTION_KEY).length > 32) {
    return Buffer.from(ENCRYPTION_KEY).slice(0, 32);
  }
  
  // If key is shorter, hash it to get a 32-byte key
  return crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
};

/**
 * Encrypts text using AES-256-CBC with a random initialization vector
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text as a hex string with IV prepended
 */
exports.encrypt = (text) => {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher with key and iv
  const cipher = crypto.createCipheriv('aes-256-cbc', getKey(), iv);
  
  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Prepend IV to encrypted data for use in decryption
  return iv.toString('hex') + ':' + encrypted;
};

/**
 * Decrypts text that was encrypted with the encrypt function
 * @param {string} encryptedText - The encrypted text with IV prepended
 * @returns {string} - The decrypted text
 */
exports.decrypt = (encryptedText) => {
  try {
    // Split IV and encrypted text
    const textParts = encryptedText.split(':');
    if (textParts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedData = textParts[1];
    
    // Create decipher with key and iv
    const decipher = crypto.createDecipheriv('aes-256-cbc', getKey(), iv);
    
    // Decrypt the text
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    // Return original text if decryption fails (for backward compatibility)
    return encryptedText;
  }
};