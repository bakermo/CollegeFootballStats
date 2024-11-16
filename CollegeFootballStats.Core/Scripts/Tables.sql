CREATE TABLE Team(
	TeamID INT NOT NULL,
	School VARCHAR2(50) NOT NULL,
	Abbreviation VARCHAR2(20),
	PRIMARY KEY(TeamID)
);
CREATE TABLE Player(
	PlayerID INT NOT NULL,
	FirstName VARCHAR2(50),
	LastName VARCHAR2(50),
	Position VARCHAR2(20),
	Weight INT,
	Year INT,
	JerseyNo INT,
	Height INT,
	PRIMARY KEY(PlayerID)
);
CREATE TABLE Coach(
	CoachID INT GENERATED ALWAYS AS IDENTITY,
	FirstName VARCHAR2(50),
	LastName VARCHAR2(50),
	PRIMARY KEY(CoachID)
);
CREATE TABLE Conference(
	ConferenceID INT NOT NULL,
	ShortName VARCHAR2(50),
	Name VARCHAR2(100),
	Division VARCHAR2(20),
	Abbreviation VARCHAR2(20),
	PRIMARY KEY(ConferenceID)
);
CREATE TABLE Game(
	GameID INT NOT NULL,
	StartDateTime DATE,
	Week INT,
	Season INT,
	HomeTeam INT NOT NULL,
	HomePoints INT,
	AwayTeam INT NOT NULL,
	AwayPoints INT,
	IsCompleted NUMBER(1),
	IsPostseason NUMBER(1),
	PRIMARY KEY(GameID),
   	FOREIGN KEY(HomeTeam) REFERENCES Team(TeamID),
    FOREIGN KEY(AwayTeam) REFERENCES Team(TeamID)
);
CREATE TABLE DraftPick(
	DraftPickID INT NOT NULL,
	Year INT,
	Round INT,
	CollegeTeam INT NOT NULL,
	NFLTeam VARCHAR2(50),
	Position VARCHAR2(20),
	OverallPick INT,
	PRIMARY KEY(DraftPickID),
	FOREIGN KEY(CollegeTeam) REFERENCES Team(TeamID)
);
CREATE TABLE Roster(
	Year INT NOT NULL,
	TeamID INT NOT NULL,
	PlayerID INT NOT NULL,
	PRIMARY KEY(PlayerID, TeamID, Year),
	FOREIGN KEY(PlayerID) REFERENCES Player(PlayerID),
	FOREIGN KEY(TeamID) REFERENCES Team(TeamID)
);
CREATE TABLE Poll(
	PollID INT GENERATED ALWAYS AS IDENTITY,
	PollName VarChar2(50),
	TeamID INT NOT NULL,
	Season INT,
	Week INT,
	Rank INT NOT NULL,
	IsPostseason NUMBER(1),
	PRIMARY KEY(PollID),
	FOREIGN KEY(TeamID) REFERENCES Team(TeamID)
);
CREATE TABLE CoachingRecord(
	CoachID INT NOT NULL,
	TeamID INT NOT NULL,
	Year INT NOT NULL,	
	Games INT,
	Wins INT,
	Losses INT,
	Ties INT,
	PRIMARY KEY(CoachID, TeamID, Year),
	FOREIGN KEY(CoachID) REFERENCES Coach(CoachID),
	FOREIGN KEY(TeamID) REFERENCES Team(TeamID)
);
CREATE TABLE ConferenceMembership(
	Year INT NOT NULL,
	TeamID INT NOT NULL,
	ConferenceID INT NOT NULL,
	PRIMARY KEY(ConferenceID, TeamID, Year),
	FOREIGN KEY(ConferenceID) REFERENCES Conference(ConferenceID),
	FOREIGN KEY(TeamID) REFERENCES Team(TeamID)
);
CREATE TABLE TeamGameStat(
	StatID INT NOT NULL,
	StatValue INT,
	StatCategory VARCHAR2(50),
	Game INT NOT NULL,
	Team INT NOT NULL,
	PRIMARY KEY(StatID),
	FOREIGN KEY (Game) REFERENCES Game(GameID),
	FOREIGN KEY (Team) REFERENCES Team(TeamID)
);	
CREATE TABLE PlayerGameStat(
	StatID INT NOT NULL,
	StatValue INT,
	StatType VARCHAR2(20),
	StatCategory VARCHAR2(20),
	Game INT NOT NULL,
	Player INT NOT NULL,
	PRIMARY KEY(StatID),
	FOREIGN KEY (Game) REFERENCES Game(GameID),
	FOREIGN KEY (Player) REFERENCES Player(PlayerID)
);
