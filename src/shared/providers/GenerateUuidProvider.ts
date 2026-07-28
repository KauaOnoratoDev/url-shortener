import { uuidv7 as uuid } from 'uuidv7';

export class GenerateUuidProvider {
    async generate(): Promise<string> {
        return uuid();
    }
}
