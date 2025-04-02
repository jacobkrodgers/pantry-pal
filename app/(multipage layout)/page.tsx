'use client'

import { Box, Pagination, InputBase } from '@mui/material';
import { useState, useEffect } from 'react';
import { getFollowers } from './actions';
import theme from '@/app/theme';
import { PublicUser } from '@/type/User';

export default function Page() {
    const [followers, setFollowers] = useState<PublicUser[]>([]);
    const [currPageNumber, setCurrPageNumber] = useState<number>(1);
    const [followersPerPage, setFollowersPerPage] = useState<number>(5);
    const [displayFollowers, setDisplayFollowers] = useState<PublicUser[]>([]);

    useEffect(() => {
        async function fetchFollowers() {
            const data = await getFollowers(currPageNumber, followersPerPage);
            setFollowers(data ?? []);
        }
        fetchFollowers();
    }, [currPageNumber, followersPerPage]);

    useEffect(() => {
        setDisplayFollowers(followers.slice((currPageNumber - 1) * followersPerPage, currPageNumber * followersPerPage));
    }, [followers, currPageNumber]);

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    padding: 2,
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: theme.palette.primary.main
                }}
            >
                {/* don't know what to put here */}
            </Box>
            <Box sx={{ p: 3 }}>
                {displayFollowers.map((follower, index) =>(
                    <div key={index}>
                        {follower.username} {/* just a placeholder for right now */}
                    </div>
                ))}
            </Box>

            {followers.length > followersPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", pb: 4}}>
                    <Pagination
                        count={Math.ceil(followers.length / followersPerPage)}
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