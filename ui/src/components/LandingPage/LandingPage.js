import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import ResultsContainer from '../ResultsContainer/ResultsContainer';
import backgroundImage from '../../images/Home_neighbourhood.png';
// import axios from 'axios';

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    width: 500px;
    max-width: 90%;
    margin-bottom: 150px;
`;

const Question = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;

    &:focus {
        border-color: #3b82f6;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const NavButton = styled.button`
    padding: 10px 20px;
    background-color: #3b82f6f0;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    align-items: center;
    margin-left: 160px;

    &:hover {
        background-color: #2563eb;
    }
`;

const SubmitButton = styled(NavButton)`
    background-color: #10b981;

    &:hover {
        background-color: #059669;
    }
`;

const LandingPage = () => {
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answer, setAnswer] =  useState('');
const navigate = useNavigate();

console.log("answer", answer);

    const questions = [
        { question: "Describe your dream home in few words", placeholder: "Describe your dream home in few words" },
        { question: "What is your budget?", placeholder: "What is your budget?" },
        { question: "What is your preferred area or zipcode?", placeholder: "What is your preferred area or zipcode?" },
        { question: "Is this an investment property", placeholder: "Is this an investment property" },
        { question: "Long term or short term", placeholder: "Long term or short term" },
    ];

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // onSubmit(answer);
        setAnswer('');
        // Navigate to the "/showResults" URL
        navigate('/showResults');
    };

    // call to the api
    // const onSubmit = async () => {
    //     try {
    //       const response = await axios.post('your-api-endpoint', {
    //         // Your data to be sent in the request body
    //       });
    //       console.log('Response:', response.data);
    //       // Do something with the response data, like navigating to a new page
    //     } catch (error) {
    //       console.error('Error:', error);
    //       // Handle error
    //     }
    //   };


    return (
        <div style={{background: `url(${backgroundImage}) no-repeat center center / cover`}}>
        <Container>
            <FormContainer>
                <Question>{questions[currentQuestion].question}</Question>
                <Input 
                    placeholder={questions[currentQuestion].placeholder} 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    // onChange={(e) => setAnswer([{question: questions[currentQuestion] , answer: e.target.value}])} 
                />
                <ButtonContainer>
                    {currentQuestion < questions.length - 1 && (
                        <NavButton onClick={handleNext}>Next</NavButton>
                    )}
                    {currentQuestion === questions.length - 1 && (
                        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
                    )}
                </ButtonContainer>
            </FormContainer>
        </Container>
        </div>
    );
};

export default LandingPage;