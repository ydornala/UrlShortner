import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow, Link } from '@material-ui/core';

import config from '../../config.json';
const LINKS_URL = `//${config.SERVE_HOSTNAME}:${config.SERVE_PORT}/api/links`;

const Links = () => {
    const [links, setLinks] = useState(null);

    useEffect(() => {
        axios.get(LINKS_URL)
            .then(res => {
                setLinks(res.data);
            });
    }, []);

    return <React.Fragment>
        {
            links ? <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Long/Actual Url</TableCell>
                  <TableCell align="right">Short Url</TableCell>
                  <TableCell align="right">Url Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {links.map(link => (
                  <TableRow key={link.name}>
                    <TableCell align="right">{link.longUrl}</TableCell>
                    <TableCell align="right">
                        <Link href={link.shortUrl} target="_blank">
                            {link.shortUrl}
                        </Link>                    
                    </TableCell>
                    <TableCell align="right">{link.urlCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> : 'Loading List'
        }
    </React.Fragment>
}

export default Links;