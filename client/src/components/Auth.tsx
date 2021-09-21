import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
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
    flex-direction: column;
    margin: 0 auto;
    max-width: 400px;
`;
const Form = styled.form`
    width: 100%;
`;
const Input = styled.input<ErrorProps>`
    width: 100%;
    padding: 10px 10px 8px;
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
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0);
    &:hover {
        background-color: #1c7ad6;
    }
`;
const ErrorMessage = styled.p`
    margin: 0;
    padding: 0;
    margin-bottom: 2px;
    font-size: 0.8em;
    min-height: 24px;
    color: #ffc6c6;
`;
const AccountHint = styled.div`
    margin-top: 10px;
    font-size: 0.8em;
    display: flex;
    justify-content: space-between;
`;

const Title = styled.h1`
    font-size: 1.4em;
    border-bottom: 1px solid lightgray;
`;

const Auth: React.FC<AuthProps> = ({ type }) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const password = useRef({});
    password.current = watch('password', '');

    const inputId = type === 'signin' ? 'current-password' : 'new-password';
    const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const minLength = {
        value: 8,
        message: 'Password must be at least 8 characters',
    };
    const required = 'This field is required';

    const signin = (data) => console.log(data);
    const signup = async (data) => {
        console.log('data to send', data);
        axios
            .post('http://localhost:3000/signup', data)
            .then((res) => {
                console.log('res', res);
                router.push('/signin');
            })
            .catch((err) => {
                console.log('err', err);
            });
    };

    return (
        <Wrapper>
            <Title> {type === 'signin' ? 'Sign in' : 'Create Account'} </Title>
            <Form onSubmit={handleSubmit(type === 'signin' ? signin : signup)}>
                <label>Email</label>
                <Input
                    autoComplete='email'
                    invalid={errors.email}
                    placeholder='Email'
                    type='text'
                    id='email'
                    {...register('email', {
                        required,
                        pattern: {
                            value: emailPattern,
                            message: 'Enter a valid email',
                        },
                    })}
                />
                <ErrorMessage>
                    {errors.email && errors.email.message}
                </ErrorMessage>

                <label>Password</label>
                <Input
                    autoComplete={inputId}
                    id={inputId}
                    invalid={errors.password}
                    placeholder='Enter password'
                    type='password'
                    {...register('password', {
                        minLength: minLength,
                        required: 'This field is required',
                    })}
                />

                <ErrorMessage>
                    {errors.password
                        ? errors.password.type === 'minLength'
                            ? 'Password must be at least 8 characters'
                            : 'This field is required'
                        : null}
                </ErrorMessage>

                {type === 'signup' && (
                    <>
                        <label>Repeat Password</label>
                        <Input
                            autoComplete={'password_repeat'}
                            id='password_repeat'
                            invalid={!!errors.password_repeat}
                            name='password_repeat'
                            placeholder='Repeat password'
                            type='password'
                            {...register('password_repeat', {
                                validate: (value) =>
                                    value === password.current ||
                                    'The passwords do not match',
                                minLength,
                                required,
                            })}
                        />
                        <ErrorMessage>
                            {errors.password_repeat &&
                                errors.password_repeat.message}
                        </ErrorMessage>
                    </>
                )}

                <Submit
                    invalid={false}
                    type='submit'
                    value={type === 'signin' ? 'Sign in' : 'Sign up'}
                />
                <AccountHint>
                    <p>
                        {type === 'signin'
                            ? "You don't have an account? "
                            : 'Already have an account? '}
                    </p>
                    <p>
                        <Link href={type === 'signin' ? '/signup' : '/signin'}>
                            <a>{type === 'signin' ? 'Sign up' : 'Sign in'}</a>
                        </Link>
                    </p>
                </AccountHint>
            </Form>
        </Wrapper>
    );
};

export default Auth;
