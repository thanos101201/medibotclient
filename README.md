# MediBot

Chatbot application for providing details regarding medicaid provided in the year 2022 in South Carolina province of United States.

## Components

The components of MediBot are mentioned below:

### `MapChart`

MapChart is the component responsible for rendering the map of South Carolina's counties. The component is also responsible for highlighting county as soon as the application is able to generate an appropriate response for the user queries.
MapChart allows user to get more details regarding any of the county, by justing clicking on the county.

### `ChatPage`

The chat interface of the application is suported by the ChatPage component. ChatPage enables user to view their conversations with the application. ChatPage is initially hidden and can be opened using
the button present at the bottom right corner of the main layout. The page can be hidden again using the same button.

### `QueryBox`

User can provide their queries to the application using QueryBox. QueryBox is present beneath ChatPage, and is initially hidden. The QueryBox can be viewed and hid using the same button which shows ChatPage.

### `Login / Sign Up`

In order to save context of conversation, the application needs to store the conversation. Saving converstion also allows the users to visit the previous conversation they had with the application.
In order to ensure privacy of the conversation, the application requrires the user to sign up or log in so that the conversation can be bound with the user credentials.

## CSVReader

CSVReader is responsible for reading the questionaire present at the csv file in the assets folder. The function makes use of *** PapaParse ***! for parsing the data read from the csv to an object.

## App

The parent application of all the components mentioned above is the App component. App component makes sure that all the child component are re-rendered as per requirement. The App provides the main layout of the application, by keeping different child components at their places on the user interface.