import './App.css';
import MainComponent from './components/MainComponent';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
        fontFamily: ['Montserrat', 'regular'].join(',')
    }
});
function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <MainComponent />
            </ThemeProvider>
        </div>
    );
}

export default App;
