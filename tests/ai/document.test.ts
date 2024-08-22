import { describe, expect, it } from 'vitest';
import { readPdf, splitAndEmbed } from '../../src/ai/document';
import { createCoverLetter } from '../../src/ai/vertex';

describe('ai', async () => {
  const docs = await readPdf('/Users/jolo/Documents/John Nguyen CV.pdf');
  describe('document-loader', () => {
    it('should load document', async () => {
      const text = docs[0].pageContent;
      expect(text).toContain('John Nguyen');
    });

    it('should split and embed', async () => {
      const retriever = await splitAndEmbed(docs);
      expect(retriever).toBeDefined();
    });
  });

  describe('vertex', async () => {
    it('should create cover letter', async () => {
      const retriever = await splitAndEmbed(docs);
      const job_description = 'Software Engineer';
      const coverLetter = await createCoverLetter(retriever, job_description);
      console.log(coverLetter);

      expect(coverLetter).not.toBe('');
    });
  });
});
