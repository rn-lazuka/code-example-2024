import Paper from '@mui/material/Paper';

export const CustomPaper = (props) => {
  return (
    <Paper
      elevation={1}
      sx={(theme) => ({
        borderRadius: 0,
        borderBottomLeftRadius: theme.spacing(1),
        borderBottomRightRadius: theme.spacing(1),
      })}
      {...props}
    />
  );
};
