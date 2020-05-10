// because github does not allow for multiple oauth
// redirect urls, we have to create a triage where
export default (req, res) => {
    const {
      query: { state, code },
    } = req
    const parsedState = JSON.parse(state);
    const Location = (parsedState.env === 'dev' ? 'http://localhost:3000/api/gh/oauth' : 'https://app.meeshkan.com/api/gh/oauth')+'?state='+state+'&code='+code;
    console.log("location", Location);
    res.writeHead(301, {
        Location
    });
    res.end();
}