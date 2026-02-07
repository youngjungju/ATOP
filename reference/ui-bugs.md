## Error Type
Build Error

## Error Message
Ecmascript file had an error

## Build Output
./app/prototype/page.tsx:1:27
Ecmascript file had an error
> 1 | import React, { useState, useEffect } from 'react';
    |                           ^^^^^^^^^
  2 | import { 
  3 |   Activity, 
  4 |   Droplets, 

You're importing a component that needs `useEffect`. This React Hook only works in a Client Component. To fix, mark the file (or its parent) with the `"use client"` directive.

 Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client

Next.js version: 16.1.6 (Turbopack)
