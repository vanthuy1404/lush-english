import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './index.css';
import Register from '../components/Register';
import Home from '../components/Home';
import Login from '../components/Login';
import Account from '../components/Account';
import Lessons from '../components/Lessons';
import TopicDetails from '../components/TopicDetails';
import Practice from '../components/Practice';
import PracticeQuestions from '../components/PracticeQuestions';
import AIMode from '../components/AIMode';
import WritingExercise from '../components/WritingExercise';
import WritingExerciseDetails from '../components/WritingExerciseDetails';
import ChattingExercise from '../components/ChattingExercise';
import ChattingExerciseDetails from '../components/ChattingExerciseDetails';
import WritingResultComponent from '../components/WritingResultComponent';
import ChattingExerciseResults from '../components/ChattingExerciseResults';


function App() {
    return (
        <Router> {/* Bọc ứng dụng trong BrowserRouter */}
            <div>
                
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/lessons" element={<Lessons />} />
                    <Route path="/lessons/:topicID" element={<TopicDetails />} />
                    <Route path="/practices" element={<Practice />} />
                    <Route path="/practices/:practiceID" element={<PracticeQuestions />} />
                    <Route path="/ai-mode/Writing" element={<WritingExercise />} />
                    <Route path="/ai-mode/Writing/:WritingExerciseID" element={<WritingExerciseDetails />} />
                    <Route path="/aimode/Chatting/:ChattingExerciseID" element={<ChattingExerciseDetails />} />
                    <Route path="/ai-mode/Chatting" element={<ChattingExercise />} />
                    <Route path="/ai-mode" element={<AIMode />} />
                    <Route path="/ai-mode/Writing/Results" element={<WritingResultComponent />} />
                    <Route path="/ai-mode/Chatting/Results" element={<ChattingExerciseResults />} />




                </Routes>
     
            </div>
        </Router>
    );
}

export default App;
