'use client'

import { Box, Pagination, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { getPeopleFollowed } from './actions';
import theme from '@/app/theme';
import { PublicUser } from '@/type/User';

export default function Page() {
    const [peopleFollowed, setPeopleFollowed] = useState<PublicUser[]>([]);
    const [currPageNumber, setCurrPageNumber] = useState<number>(1);
    const [peopleFollowedPerPage, setPeopleFollowedPerPage] = useState<number>(5);
    const [displayPeopleFollowed, setDisplayPeopleFollowed] = useState<PublicUser[]>([]);

    useEffect(() => {
        async function fetchPeopleFollowed() {
            const data = await getPeopleFollowed(currPageNumber, peopleFollowedPerPage);
            setPeopleFollowed(data ?? []);
        }
        fetchPeopleFollowed();
    }, [currPageNumber, peopleFollowedPerPage]);

    useEffect(() => {
        setDisplayPeopleFollowed(peopleFollowed.slice((currPageNumber - 1) * peopleFollowedPerPage, currPageNumber * peopleFollowedPerPage));
    }, [peopleFollowed, currPageNumber]);

    return (
        <>
            <Box sx={{ p: 3 }}>
                {displayPeopleFollowed.map((userFollowed, index) => (
                    <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6">{userFollowed.username}</Typography>
                    </Paper>
                ))}
            </Box>

            {peopleFollowed.length > peopleFollowedPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", pb: 4}}>
                    <Pagination
                        count={Math.ceil(peopleFollowed.length / peopleFollowedPerPage)}
                        page={currPageNumber}
                        onChange={(_e, value) => setCurrPageNumber(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </>
    );
}