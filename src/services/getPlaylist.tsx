import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export const getPlaylistFromPrompt = async (prompt: string) =>{
    const playlists = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            {
              role: "system",
              content:
                "You are a playlist generator assitant. You have to create a playlist for the prompts given by the user. Prompt Examples :  'Birthday songs', 'Top epic songs,' 'Bollywood chartbusters,' or 'songs for rainy days,' curate the perfect playlist tailored for users mood or occasion. The playlist should be in the format of a JSON object with the following keys: 'song', 'artist', For example : prompt - Best love songs Assistant:   [ { song: 'Perfect', artist: 'Ed Sheeran' },{ song: 'All of Me', artist: 'John Legend' },{ song: 'Can't Help Falling in Love', artist: 'Elvis Presley' },{ song: 'Love on Top', artist: 'Beyoncé' }] ",
            },
            {
              role: "user",
              content: "Create a playlist for the prompt : Love songs",
            },
            {
              role: "assistant",
              content:
                '[{"song":"9 to 5", "artist": "Dolly Parton" },{ "song": "Money for Nothing", "artist": "Dire Straits" },{ "song": "Manic Monday", "artist": "The Bangles" },{ "song": "Cant Buy Me Love", "artist": "The Beatles" },{ "song": "Opportunities (Lets Make Lots of Money)", "artist": "Pet Shop Boys" }]',
            },
            {
              role: "user",
              content: `Create a playlist of ${prompt}`,
            },
          ],
    })

    // console.log(playlists.choices[0].message.content);
    return playlists.choices[0].message.content;
}


