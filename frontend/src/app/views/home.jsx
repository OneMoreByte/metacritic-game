import { Card, Container } from "@mui/material";




const Home = (props) => {
    return (
        <div>
            <Card
                sx={{
                    marginTop: '5px',
                    minHeight: '90vh',
                    minWidth: '70vh'
                }}
            >
                <h1>Hello Jack</h1>
            </Card>
        </div>
    );
}

export default Home;