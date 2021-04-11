import {DraftServer} from "../DraftServer";
import getPort from "get-port";
import request from "request";
import temp from "temp";
import * as fs from "fs";
import path from "path";

let httpServer: any;
let httpServerAddr: any;
let ioServer: any;
let draftServer: DraftServer;

beforeEach(() => {
    temp.track();
    const dirPath = temp.mkdirSync('serverTest');
    fs.mkdirSync(path.join(dirPath, 'data'));
    draftServer = new DraftServer(dirPath);
});

afterEach(() => {
    temp.cleanupSync();
});


beforeEach((done) => {
    getPort().then((port: number) => {
        console.log("Got port: " + port);
        const serve = draftServer.serve(port);
        httpServer = serve.httpServer;
        httpServerAddr = serve.httpServerAddr;
        ioServer = serve.io;
        done();
    });
});

afterEach((done) => {
    ioServer.close();
    httpServer.close();
    done();
});

it('maintenanceMode is initially false', (done) => {
    request.get(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/state`, (error, response, body) => {
        expect(response.statusCode).toEqual(200);
        const json = JSON.parse(body);
        expect(json.maintenanceMode).toEqual(false);
        done();
    });
});

it('maintenanceMode can be set to true', (done) => {
    request.post(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/state`,
        {body: JSON.stringify({maintenanceMode: true}), headers: {'Content-Type': 'application/json; charset=UTF-8'}},
        (error, response, body) => {
            expect(response.statusCode).toEqual(200);
            const json = JSON.parse(body);
            expect(json.maintenanceMode).toEqual(true);
            done();
        });
});

it('hiddenPresetIds is initially empty', (done) => {
    request.get(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/state`, (error, response, body) => {
        expect(response.statusCode).toEqual(200);
        const json = JSON.parse(body);
        expect(json.hiddenPresetIds).toEqual([]);
        done();
    });
});

it('hiddenPresetIds can be filled', (done) => {
    request.post(`http://[${httpServerAddr.address}]:${httpServerAddr.port}/api/state`,
        {
            body: JSON.stringify({hiddenPresetIds: ['abc', 'xyz']}),
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        },
        (error, response, body) => {
            expect(response.statusCode).toEqual(200);
            const json = JSON.parse(body);
            expect(json.hiddenPresetIds).toEqual(['abc', 'xyz']);
            done();
        });
});
