import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { compile } from '@noir-lang/noir_wasm';
import { Noir } from '@noir-lang/noir_js';
import { ProofData } from '@noir-lang/types';
import { expect } from 'chai';
import 'mocha';
import circuit_ecdh from '../../ecdh/target/ecdh.json';

// RUN: npx mocha -r ts-node/register tests/ecdh.tests.ts
// This will not run with yarn tests
// That is a different setup

function generatePrivateKey(): Uint8Array {
    return randomBytes(32);
}

describe("ECDH Circuit Tests", function() {
    let correctProof;
    it('Should generate valid proof for correct input', async () => {
        const circuitFile = readFileSync(resolve(__dirname, '../target/ecdh.json'), 'utf-8');
        const circuit = JSON.parse(circuitFile);
        const backend = new BarretenbergBackend(circuit);
        const noir = new Noir(circuit, backend);
        let pk1 = generatePrivateKey();
        let pk2 = generatePrivateKey();

        // Convert Uint8Array to regular arrays
        const input = {
            private_key1: Array.from(pk1),
            private_key2: Array.from(pk2)
        };

        // Generate proof
        correctProof = await noir.generateProof(input);
        expect(correctProof.proof).to.be.true;
    });
});
  
// describe("ECDH Circuit Tests", function() {
//     let noir: Noir;
//     let correctProof: ProofData;
//     beforeEach(async () => {
//         const circuitFile = readFileSync(resolve('../target/ecdh.json'), 'utf-8');
//         const circuit = JSON.parse(circuitFile);
//         const backend = new BarretenbergBackend(circuit);
//         noir = new Noir(circuit, backend);   
//     });
//     it('Should generate valid proof for correct input', async () => {
       
//         let pk1 = generatePrivateKey();
//         let pk2 = generatePrivateKey();
//         const input = {
//             private_key1: Array.from(pk1),
//             private_key2: Array.from(pk2)
//         };

//         // Generate proof
//         correctProof = await noir.generateProof(input);
//         expect(correctProof.proof).to.be.true;
//     });
    
//     it('Should verify valid proof for correct input', async () => {
//         const verification = await noir.verifyProof(correctProof);
//         expect(verification).to.be.true;
//     });
  
// });


