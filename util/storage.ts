import { existsSync as exists } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

export class Storage<T> {

    #path: string;
    #inital: T;
    #cache: T;

    constructor(file: string, initial: T){
        this.#path = join(__dirname, '../storage', `${file}.json`);
        this.#inital = initial;
        this.fetch();
    }

    set data(data){
        this.#cache = data;
        this.#save();
    }

    get data(){
        return this.#cache;
    }

    async fetch(){

        if(!exists(this.#path))
            return this.#reset();

        try{

            let json = await readFile(this.#path, 'utf-8');
            this.#cache = JSON.parse(json);
            return this.data;
            
        }catch(e){
            console.error(e);
            return this.#reset();
        }
    }

    async #save(){
        let dir = dirname(this.#path);
        await mkdir(dir, { recursive: true });
        return writeFile(this.#path, JSON.stringify(this.#cache, null, 2));
    }

    #reset(){
        this.data = this.#inital;
        return this.data;
    }

}