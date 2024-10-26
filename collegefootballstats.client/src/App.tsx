import { useEffect, useState } from 'react';
import './App.css';

//bullshit API returns camelCase and theres no quick easy way to configure it to return PascalCase
interface Team {
    teamId: number;
    school: String;
    abbreviation: String;
}

function App() {

    const [teams, setTeams] = useState<Team[]>();
    useEffect(() => {
        populateTeams();
    }, []);

    const contents = teams === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Team ID</th>
                    <th>School</th>
                    <th>Abbreviation</th>
                </tr>
            </thead>
            <tbody>
                {teams.map(team =>
                    <tr key={team.teamId}>
                        <td>{team.teamId}</td>
                        <td>{team.school}</td>
                        <td>{team.abbreviation}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tabelLabel">Teams</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateTeams() {
        const response = await fetch('api/teams');
        const data = await response.json();
        console.log(data);
        setTeams(data);
    }
}

export default App;