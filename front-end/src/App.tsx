
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TransactionList from './components/Transaction/TransactionItem';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/transactions" element={<TransactionList />} />
            </Routes>
        </Router>
    );
};

export default App;
