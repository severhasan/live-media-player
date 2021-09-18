import styled from 'styled-components';
// import Link from 'next/link';

const Wrapper = styled.div`
    background-color: #353d48;
    color: white;
    font-size: 2em;
`;
const Nav = styled.nav`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
`;

const Navigation: React.FC = () => {

    return (
        <Wrapper>
            <Nav>
                <p>Live Media</p>
                {/* <p><Link href='/'><a>Live Media</a></Link></p>
                <p><Link href='/admin'><a>Admin</a></Link></p> */}
            </Nav>
        </Wrapper>
    )
}

export default Navigation;
