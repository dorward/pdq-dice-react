import discord from './discord';
import server from './server';

const port = parseInt(process.env.PORT || '5101');

discord.on('clientReady', () => {
    console.log(`Logged in as ${discord?.user?.tag}!`);
});

const starter = new server()
    .start(port)
    .then((port) => console.log(`Running on port ${port}`))
    .catch((error) => {
        console.log(error);
    });

export default starter;
