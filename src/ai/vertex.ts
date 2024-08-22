import type { Document } from '@langchain/core/documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import type { VectorStoreRetriever } from '@langchain/core/vectorstores';
import { VertexAI } from '@langchain/google-vertexai';
import type { MemoryVectorStore } from 'langchain/vectorstores/memory';

const vertex = new VertexAI({
  model: 'gemini-1.5-pro',
  temperature: 0,
});

const template = `You are an experienced HR professional skilled at crafting effective cover letters. Your task is to generate a compelling cover letter tailored to a specific job opening, based on the provided CV and job description.
Inputs
CV: {cv} 
Job Description: {job_description}
Instructions
Carefully review the candidate's CV to understand their qualifications, experience, and skills relevant to the job opening.
Analyze the job description to identify the key requirements, responsibilities, and desired qualifications for the role.
Craft a well-structured cover letter that highlights how the candidate's background aligns with the job requirements. The cover letter should:
Have an engaging introduction that grabs the reader's attention
Clearly outline the candidate's relevant skills and experience for the role
Explain why the candidate is an excellent fit for the position
Use persuasive language and a positive, professional tone
Be concise, typically no more than one page in length
Ensure the cover letter is free of errors and follows standard formatting conventions for business correspondence.
Please also mention that I love blogging on Medium or Dev.to and that I became an AWS Community Builder in 2024.
Output
The final output should be a polished, tailored cover letter that effectively markets the candidate for the specific job opening, based on the provided CV and job description.
`;

const prompt = PromptTemplate.fromTemplate(template);

const formatDocumentsAsString = (documents: Document[]) => {
  return documents.map((document) => document.pageContent).join('\n\n');
};

export async function createCoverLetter(
  vectorStoreRetriever: VectorStoreRetriever<MemoryVectorStore>,
  job_description: string,
) {
  const chain = RunnableSequence.from([
    {
      cv: vectorStoreRetriever.pipe(formatDocumentsAsString),
      job_description: new RunnablePassthrough(),
    },
    prompt,
    vertex,
    new StringOutputParser(),
  ]);
  const result = await chain.invoke(job_description);
  console.log('result', result);

  return result;
}
