import styled from '@emotion/styled';

export const SearchContainer = styled.div`
    
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 24px;
    padding: 10px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

export const SearchInput = styled.input`
    border: none;
    outline: none;
    flex-grow: 1;
    font-size: 18px;
    padding: 5px;
`;

export const SpeechButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
`;