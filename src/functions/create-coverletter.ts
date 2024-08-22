import { readPdf, splitAndEmbed } from '../ai/document';
import { createCoverLetter } from '../ai/vertex';

export const handler = async (req, res) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  const { job } = req.body;
  console.log('Job description:', job);

  const docs = await readPdf('/Users/jolo/Documents/John Nguyen CV.pdf');
  const retriever = await splitAndEmbed(docs);
  const result = await createCoverLetter(retriever, job);

  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      result,
    }),
  );
  return new Response(JSON.stringify(result));
};
