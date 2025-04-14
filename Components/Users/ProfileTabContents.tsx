import { Box, 
         IconButton,
         Typography, 
         Paper, 
         Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

type User = {
  username: string;
  joinDate: string; // ISO date string
  recipeCount: number;
};

export default function ProfileTabContents({ user }: { user: User }) {
  const formattedDate = new Date(user.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5">{user.username}</Typography>
        <IconButton aria-label="edit profile" size="small">
          <EditIcon />
        </IconButton>
      </Box>

      <Typography sx={{ mt: 2 }}>
        Joined on {formattedDate}
      </Typography>

      <Link
        href={`/${user.username}/recipes`}
        underline="hover"
        sx={{ display: 'inline-block', mt: 1 }}
      >
        View all recipes ({user.recipeCount})
      </Link>
    </Paper>
  );
}
