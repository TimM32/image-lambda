'use strict';

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Response } from 'node-fetch';


const s3Client = new S3Client({region: 'us-east-2'});

export const handler = async(event) => {
  console.log('Event is live!', event);
    
  const Bucket = '';
  const Key ='images.json';
  console.log('Bucket and Key here', { Bucket, Key });

  let file = event.Records[0].s3.object.key;
  let size = event.Records[0].s3.object.size;
  let type = 'jpg';
  let newImage = { file, size, type };
  console.log('New Image here!', newImage);
  
  
  
  const params = { Key, Bucket };  
  console.log('Params =>', params);
    
  let data;
 
  try {
        
    let s3Results = await s3Client.send(new GetObjectCommand(params));
    const response = new Response(s3Results.Body);
    data = await response.json();

    data.push(newImage);
    params.Body = JSON.stringify(data);
    console.log('data post data push request', data);
      
  }catch(error){
    console.warn('Handler Event Error:', error);
    
  }
    
    
  

  let newParams = { 
    Key: 'image.json',
    ImageType: 'application-json', 
  
  };

  try {
    await s3Client.send(new PutObjectCommand(newParams));
    
  } catch (error) {
    console.log('Error encountered: ', error);
  }
  
  const response = {
    status: 200,
    body: JSON.stringify(newParams),
  };

  return response;

};
    