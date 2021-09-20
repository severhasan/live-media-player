import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Link from 'next/link';

interface AuthProps {
    type: 'signin' | 'signup';
}
interface ErrorProps {
    invalid: boolean;
}

const Wrapper = styled.div`
    display: flex;
    margin: 0 auto;
    max-width: 400px;
`;
const Form = styled.form`
    width: 100%;
`;
const Input = styled.input<ErrorProps>`
    width: 100%;
    padding: 8px 8px 6px;
    font-size: 18px;
    border-radius: 4px;
    color: #444;
    border-width: 1px 1px 1px 20px;
    border-color: dodgerblue;
    border-style: solid;
    cursor: pointer;
    ${(props) =>
        props.invalid &&
        `
    background-color: rgb(255, 230, 240);
    border-color: #ff6c6c;
    `}
    margin-top: 4px;
    &:first-of-type {
        margin: 0;
    }
    transition: background-color 200ms ease-out;
`;
const Submit = styled(Input)`
    background-color: dodgerblue;
    color: white;
    margin-top: 20px;
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0);
    &:hover {
        background-color: #1c7ad6;
    }
`;
const ErrorMessage = styled.p`
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
    min-height: 24px;
`;
const AccountHint = styled.p`
    margin-top: 10px;
    font-size: 0.8em;
`;

const Auth: React.FC<AuthProps> = ({ type }) => {
    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm();

    const inputId = type === 'signin' ? 'current-password' : 'new-password';
    const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const signin = (data) => console.log(data);
    const signup = (data) => console.log(data);

    return (
        <Wrapper>
            <Form onSubmit={handleSubmit(type === 'signin' ? signin : signup)}>
                <Input
                    invalid={errors.email}
                    placeholder='Email'
                    type='text'
                    id='email'
                    {...register('email', {
                        required: true,
                        pattern: emailPattern,
                    })}
                />
                <ErrorMessage>
                    {errors.email
                        ? errors.email.type === 'pattern'
                            ? 'Enter a valid email'
                            : 'This field is required'
                        : null}
                </ErrorMessage>

                <Input
                    autoComplete={inputId}
                    id={inputId}
                    invalid={errors.password}
                    placeholder='Enter password'
                    type='password'
                    {...register('password', { minLength: 8, required: true })}
                />

                <ErrorMessage>
                    {errors.password
                        ? errors.password.type === 'minLength'
                            ? 'Password must be at least 8 characters'
                            : 'This field is required'
                        : null}
                </ErrorMessage>

                <Submit
                    invalid={false}
                    type='submit'
                    value={type === 'signin' ? 'Sign in' : 'Sign up'}
                />
                <AccountHint>
                    {type === 'signin'
                        ? "You don't have an account? "
                        : 'Already have an account? '}
                    <Link href={type === 'signin' ? '/signup' : '/signin'}>
                        <a>{type === 'signin' ? 'Sign up' : 'Sign in'}</a>
                    </Link>
                </AccountHint>
            </Form>
        </Wrapper>
    );
};

export default Auth;
