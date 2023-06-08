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
    // summary = []
  }
    
  console.log('this is my data', data);
    
  // in demo I do calculations here, in lab, you'll assemble your params object AND use the PutObjectCommand

  // new params for putOBjectCommand
  // POSSIBLY what you need for lab-17
  // let newParams = {
  //     ...params,
  //     Key: 'images.json',
  //     Body: '<updatedSummaryJson>',
  //     ContentType: "application/json" // For JSON, it's always this
  // }
  const { numberOne, numberTwo } = data.numbers;
  const result = numberOne + numberTwo;
  console.log('my result', result);
  // TODO implement
  const response = {
    statusCode: 200,
    // send valid json (a number is valid json)
    body: result,
  };
  return response;
};