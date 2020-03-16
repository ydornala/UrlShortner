import React, { useState } from 'react';
import { Grid, TextField, Paper, Button } from '@material-ui/core';
import axios from 'axios';
import { useForm } from 'react-hook-form'
import * as yup from 'yup';

import config from '../../config.json';
const LINKS_URL = `//${config.SERVE_HOSTNAME}:${config.SERVE_PORT}/api/links`;

const schema = yup.object().shape({
    longUrl: yup.string().required()
  });

const CreateLink = () => {
    const [url, setUrl] = useState(null);
    const { register, handleSubmit, errors } = useForm({
        validationSchema: schema
    });

    const handleShortSubmit = data => {
        const {longUrl} = data;

        axios.post(LINKS_URL, { longUrl })
            .then(res => {
                alert('Short Url created!')
            })
            .catch(err => alert('Error Occurred'));
    }

    return <React.Fragment>
        <div>
            <Grid container>
                <Grid item md={12}>
                    <form onSubmit={handleSubmit(handleShortSubmit)}>
                        <Paper>
                            <TextField error={!!errors.longUrl} name="longUrl" inputRef={register} fullWidth placeholder="Inser Long Url" variant="outlined"/>
                        </Paper>
                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                </Grid>
            </Grid>
        </div>
    </React.Fragment>
}

export default CreateLink;