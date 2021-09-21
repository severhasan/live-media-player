import styled from 'styled-components';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div`
    background-color: #353d48;
    color: white;
    font-size: 1.8em;
`;
const Nav = styled.nav`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    a {
        text-decoration: none;
    }
`;

const Navigation: React.FC = () => {
    return (
        <Wrapper>
            <Nav className='container'>
                <p>
                    <Link href='/'>
                        <a>Live Media</a>
                    </Link>
                </p>
                <p>
                    <Link href='/signin'>
                        <a>
                            <FontAwesomeIcon size='xs' icon='user' />
                        </a>
                    </Link>
                </p>
            </Nav>
        </Wrapper>
    );
};

export default Navigation;
