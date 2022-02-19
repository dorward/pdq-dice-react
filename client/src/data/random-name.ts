import { Config, names, uniqueNamesGenerator } from 'unique-names-generator';

const config: Config = {
	dictionaries: [names],
};

const randomName = (): string => uniqueNamesGenerator(config); // red_big_donkey

export default randomName;
