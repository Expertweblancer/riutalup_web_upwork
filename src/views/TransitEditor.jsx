import React, { useContext, useState, Fragment } from "react";
import { AppContext } from "../AppContext";
import { planets, signNumber, signs } from "../unicode";
import { updateFirebaseEvent } from "../services/dataService";
import { Grid, TextField, Button } from "@material-ui/core";
import TransitEvent from "./TransitEvent";

const TransitEditor = ({ event: e }) => {
  let user = useContext(AppContext);

  const [formValue, setFormValue] = useState(e);
  const [editable, setEditable] = useState(false);

  const handleChange = ({ target }) => {
    setFormValue({ ...formValue, [target.name]: target.value });
  };

  const handleSubmit = async () => {
    updateFirebaseEvent(formValue).then(() => {
      setEditable(!editable);
    });
  };

  return (
    <div className="p-16">
      {formValue && (
        <Grid container spacing={3}>
          <Grid item lg={3}>
            <div className="transitCard mb-32">
              <TransitEvent event={e}></TransitEvent>
              {e.description1 && <p className="m-0 mb-4">{e.description1}</p>}
              {e.description2 && <p className="m-0 mb-4">{e.description2}</p>}
              {e.description3 && <p className="m-0 mb-4">{e.description3}</p>}
              {e.description4 && <p className="m-0 mb-4">{e.description4}</p>}
              {e.artwork && (
                <div className="artwork position-relative">
                  <img src={e.artwork} alt="artwork" className="mb-4 h-100" />
                </div>
              )}
              {e.yogaImg && (
                <div className="position-relative">
                  <img src={e.yogaImg} alt="artwork" className="mb-4 h-100" />
                </div>
              )}
              {e.yogaDescription && (
                <p className="m-0 mb-8">{e.yogaDescription}</p>
              )}
              {user && user.isAdmin && (
                <Button
                  className="mt-4"
                  variant="contained"
                  color="primary"
                  onClick={() => setEditable(!editable)}
                >
                  edit
                </Button>
              )}
            </div>
          </Grid>
          {editable && (
            <Fragment>
              <Grid item lg={3}>
                <TextField
                  label="Description 1"
                  variant="outlined"
                  className="mb-16"
                  name="description1"
                  fullWidth
                  defaultValue={formValue.description1}
                  onChange={handleChange}
                />
                <TextField
                  label="Description 2"
                  variant="outlined"
                  className="mb-16"
                  name="description2"
                  fullWidth
                  defaultValue={formValue.description2}
                  onChange={handleChange}
                />
                <TextField
                  label="Description 3"
                  variant="outlined"
                  className="mb-16"
                  name="description3"
                  fullWidth
                  defaultValue={formValue.description3}
                  onChange={handleChange}
                />
                <TextField
                  label="Description 4"
                  variant="outlined"
                  className="mb-16"
                  name="description4"
                  fullWidth
                  defaultValue={formValue.description4}
                  onChange={handleChange}
                />

                <div>
                  <Button
                    className="mr-12"
                    variant="contained"
                    color="secondary"
                    onClick={() => setEditable(!editable)}
                  >
                    cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    save
                  </Button>
                </div>
              </Grid>
              <Grid item lg={3}>
                <TextField
                  label="Artwork Url"
                  variant="outlined"
                  className="mb-16"
                  name="artwork"
                  fullWidth
                  placeholder="http://ssweb.com"
                  defaultValue={formValue.artwork}
                  onChange={handleChange}
                />
                <TextField
                  label="Yoga Image Url"
                  variant="outlined"
                  className="mb-16"
                  name="yogaImg"
                  fullWidth
                  placeholder="http://ssweb.com"
                  defaultValue={formValue.yogaImg}
                  onChange={handleChange}
                />
                <TextField
                  label="Yoga Description"
                  variant="outlined"
                  className="mb-16"
                  name="yogaDescription"
                  fullWidth
                  defaultValue={formValue.yogaDescription}
                  onChange={handleChange}
                />
              </Grid>
            </Fragment>
          )}
        </Grid>
      )}
    </div>
  );
};

export default TransitEditor;
