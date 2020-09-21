import React, { useState, useContext, useEffect } from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

import './../../views/wizard.css';

import WizardContext from '../../helpers/wizardContext';

const Objective = (props) => {
    const { addToast } = useToasts();
    const { percentageCompletion} = props;
    let history = useHistory();
    let location = useLocation();
    const [objective, setObjective] = useState('');
    const [edit, setEdit] = useState(false)
    const context = useContext(WizardContext);
    const {setWizardValues, wizardState} = context;
    const editValue = location && location.state ? location.state.edit : false;

    useEffect(() => {
        setObjective(wizardState.objective);
        setEdit(editValue)
      }, [wizardState.objective, editValue]);

    const handleInput = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setObjective( value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (objective) {
            setWizardValues({objective, percentageCompletion: 7.6923})
            history.push('/wizard/job-post-details');   

        } else {
            return addToast("Please provide your job post's objective", {
                appearance: 'error',
                autoDismiss: true,
            });
        }
    }

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        setWizardValues({objective})
        history.push('/wizard/wizard-review')
    }

    return (
            <div style={{overflowY: 'hidden'}} class="row">
                <div style={{minHeight: '100vh'}} class="col-xl-6 col-lg-6 wizard-div-top">
                    <div style={{height: '100%'}} class="row align-items-center animate__animated animate__fadeInRight">
                        <div class="col-xl-12 col-lg-12">
                            <div class='pageTitle' style={{fontSize: '50px', margin: '15px'}}>Objective</div>
                            <div style={{margin: '15px'}}>In less than 10 words, describe what your product does.</div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-6 col-lg-6 wizard-div">
                        <div style={{minHeight: '100%'}} class="row align-items-center animate__animated animate__bounceInUp">
                            <div class="col-xl-12 col-lg-12">
                                <input  onInput={handleInput} style={{paddingLeft: '8px', fontSize: '15px', height: '40px', border:'0.5px #a1a9e4 solid', marginBottom:'10px', color: 'white', background: 'transparent', padding: '50px'}} class="wizard-text-area-input objective-input" maxLength={100} placeholder="Job post objective" defaultValue={objective}/>
                            </div>

                            <div style={{ width: '100%', padding: '2%'}}>
                                <div class="d-flex justify-content-between">
                                    {edit ? 
                                    <>
                                        <button class="button ripple-effect gray-button "><i class="icon-material-outline-arrow-back"></i>Back</button>
                                        <button onClick={handleSubmitEdit} class="button ripple-effect wizard-button">Review<i class="icon-material-outline-arrow-forward"></i></button>
                                    </> : 
                                    <>
                                        <button style={{opacity: 0}} class="button ripple-effect gray-button"><i class="icon-material-outline-arrow-back"></i>Back</button>
                                        <button onClick={handleSubmit} class="button ripple-effect wizard-button">Next<i class="icon-material-outline-arrow-forward"></i></button>
                                    </>
                                    }
                                </div>
                                { edit ? null :
                                <div style={{marginTop: '60px', padding: '2%'}}>
                                    <Progress percent={Math.floor(Math.floor(percentageCompletion))} 
                                            theme={
                                                {
                                                active: {
                                                    symbol: `${Math.floor(percentageCompletion)}%`,
                                                    trailColor: '#5869ee',
                                                    color: '#ffffff'
                                                },
                                                }
                                            }
                                        />
                                </div>
                                }
                            </div>
                        </div>
                </div>
            </div>
    );
}

export default Objective;