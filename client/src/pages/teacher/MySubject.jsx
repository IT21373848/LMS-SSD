import { Box, Button, FormControl, FormControlLabel, FormLabel, Input, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import authAxios from '../../utils/authAxios';
import { apiUrl } from '../../utils/Constants';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Loader from '../../components/Loader/Loader';
import EditIcon from '@mui/icons-material/Edit';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateGrade } from '../../utils/usefulFunctions';
import { usePDF } from 'react-to-pdf';
import Cookies from 'js-cookie'

const MySubject = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id, subject, grade } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: `${new Date().toUTCString().toString()}-mySubject.pdf` });
  const navigate = useNavigate();
  const [term, setTerm] = useState(1);
  const [selectedActivity, setSelectedAct] = useState({})
  const [subjectMarks, setSubMarks] = useState([]);
  const [data, setData] = useState([])
  const [max, setMax] = useState(100);
  const [min, setMin] = useState(0)
  const [activity, setActivity] = useState({
    title: '',
    desc: '',
    link: '',
    actType: 'activity',
    file: null
  })
  
  const handleClose = () => {
    setOpen(false)
    setUpdateOpen(false)
  }

  //HANDLE THE Activity CREATION FIELDS
  const handleCreateChange = (field, value) => {
    setActivity((prevData) => ({ ...prevData, [field]: value }));
  };

  //HANDLE THE Activity CREATION FIELDS
  const handleUpdateChange = (field, value) => {
    setSelectedAct((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFileChange = (e) => {
    setActivity((prevData) => ({ ...prevData, file: e.target.files[0] }));
  };

  const getAllActivity = async () => {
    try {
      const data = await authAxios.get(`${apiUrl}/activity/${id}`)
      setAssignments(data.data);
      setIsLoading(false)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const deleteAct = async (id) => {
    console.log(id);
    try {
      const deleted = await authAxios.delete(`${apiUrl}/activity/${id}`);
      if (deleted.data) {
        toast.success('Activity Deleted Success!');
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const handleActCreate = async () => {
    try {
      if (!activity.title || !activity.desc) {
        throw Error('Title and Description is Required')
      }
      
      if (activity.actType === 'PDF' && !activity.file) {
        throw Error('PDF file is required');
      }

      const formData = new FormData();
      formData.append('title', activity.title);
      formData.append('desc', activity.desc);
      formData.append('subId', id); // subject ID
      formData.append('file', activity.file); // Append PDF file if activity type is PDF

      const endpoint = activity.actType === 'PDF' ? 'pdf/add' : `activity/${id}`;
      const submitedAct = await authAxios.post(`${apiUrl}/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (submitedAct.data) {
        toast.success('Activity Created Success!');
        setRefresh((prev) => !prev);
      }

    } catch (error) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(error.response.data.message);
      }
    }
  }

  const handleActUpdate = async () => {
    try {
      if (!selectedActivity.title || !selectedActivity.desc) {
        throw Error('Title and Description is Required')
      }
      const submitedAct = await authAxios.put(`${apiUrl}/activity/${selectedActivity._id}`, selectedActivity);
      if (submitedAct.data) {
        toast.success('Activity Updated Success!');
        setRefresh((prev) => !prev);
      }

    } catch (error) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(error.response.data.message);
      }
    }
  }

  function processDataForChart(data) {
    const markRanges = ["0-35", "36-45", "46-65", "66-75", "76-100"];
    const countObj = {};

    if (data) {
      markRanges.forEach(range => {
        countObj[range] = 0;
      });

      data?.forEach(entry => {
        const mark = entry.mark;
        if (mark >= 0 && mark <= 35) {
          countObj["0-35"]++;
        } else if (mark >= 36 && mark <= 45) {
          countObj["36-45"]++;
        } else if (mark >= 46 && mark <= 65) {
          countObj["46-65"]++;
        } else if (mark >= 66 && mark <= 75) {
          countObj["66-75"]++;
        } else if (mark >= 76 && mark <= 100) {
          countObj["76-100"]++;
        }
      });

      const chartData = Object.keys(countObj).map(range => {
        return { range: range, marks: countObj[range] };
      });

      return chartData;
    } else {
      return null
    }
  }

  const getSubjectMarks = async () => {
    try {
      const resp = await authAxios.get(`${apiUrl}/subject/marks/${id}/${term}`)
      setSubMarks(resp.data)
      const da = processDataForChart(resp?.data[0]?.marks)
      setData(da)
    } catch (error) {
      console.log(error);
    }
  }

  const handleShowUpdate = (row) => {
    setSelectedAct(row);
    setUpdateOpen(true);
  }

  useEffect(() => {
    getSubjectMarks()
  }, [term])

  useEffect(() => {
    getAllActivity();
  }, [refresh])

  const assignmentType = assignments.reduce(
    (acc, assignment) => {
      if (assignment.actType === 'activity') {
        acc.assignments.push(assignment);
      } else if (assignment.actType === 'learning') {
        acc.materials.push(assignment);
      }
      return acc;
    },
    { assignments: [], materials: [] }
  );

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className='bg-white p-3 rounded-lg shadow-md'>
      <Typography variant='h5' textAlign={'center'}>{subject + ' - ' + grade}</Typography>
      <Button variant='contained' color='warning' onClick={() => setOpen(true)}>Create New Activity</Button>
      <Button variant='contained' color='secondary' sx={{ float: 'right' }} onClick={() => navigate(`../subjmarks/${id}/${subject}/${grade}`)}>Publish Marks</Button>
      {
        !isLoading ? <>
          <div>
            <Typography variant='h6'>Current Assignments</Typography>
            <br />
            {
              assignmentType.assignments.map((act, key) => (
                <div className='bg-amber-500 text-white rounded-lg p-3 mb-3 relative' key={key}>
                  <h4>{act.title}</h4>
                  <p className='text-xs'>{act.desc}</p>
                  <p className='text-right text-xs text-gray-300'>{act.createdAt}</p>

                  <div className='absolute top-0 right-0 cursor-pointer'>
                    <EditIcon fontSize='medium' color='warning' onClick={() => handleShowUpdate(act)} />
                    <DeleteForeverIcon fontSize='medium' color='error' onClick={() => deleteAct(act._id)} />
                  </div>
                </div>
              ))
            }
          </div>
          <br />
          <div>
            <Typography variant='h6'>Given Learning Materials</Typography>
            <br />
            {
              assignmentType.materials.map((lmt, key) => (
                <div className='bg-amber-500 text-white rounded-lg p-3 mb-3 relative' key={key}>
                  <h4>{lmt.title}</h4>
                  <p className='text-xs'>{lmt.desc}</p>
                  <p className='text-right text-xs text-gray-300'>{lmt.createdAt}</p>

                  <div className='absolute top-0 right-0 cursor-pointer'>
                    <EditIcon fontSize='medium' color='warning' onClick={() => handleShowUpdate(lmt)} />
                    <DeleteForeverIcon fontSize='medium' color='error' onClick={() => deleteAct(lmt._id)} />
                  </div>
                </div>
              ))
            }
          </div>
          <div className='w-full flex justify-end'>
            <Button variant='contained' color='success' onClick={toPDF}>Download PDF</Button>
          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create New Activity
              </Typography>
              <div className='flex flex-col w-full space-y-5 mb-10'>
                <TextField
                  placeholder='Title'
                  fullWidth
                  label='Title'
                  value={activity.title}
                  onChange={(e) => handleCreateChange('title', e.target.value)}
                ></TextField>

                <TextField
                  placeholder='Description'
                  fullWidth
                  label='Description'
                  value={activity.desc}
                  onChange={e => handleCreateChange('desc', e.target.value)}
                ></TextField>

                {activity.actType === 'PDF' && (
                  <div className='my-4'>
                    <input
                      type='file'
                      accept='application/pdf'
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Activity Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={activity.actType}
                  onChange={e => handleCreateChange('actType', e.target.value)}
                >
                  <FormControlLabel value="activity" control={<Radio />} label="Assignment" />
                  <FormControlLabel value="learning" control={<Radio />} label="Learning Material" />
                  <FormControlLabel value="PDF" control={<Radio />} label="Upload PDF" />
                </RadioGroup>
              </FormControl>

              <Button variant='contained' color='success' onClick={handleActCreate}>Create</Button>
            </Box>
          </Modal>

          <Modal
            open={updateOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Update Activity
              </Typography>
              <div className='flex flex-col w-full space-y-5 mb-10'>
                <TextField
                  placeholder='Title'
                  fullWidth
                  label='Title'
                  value={selectedActivity.title}
                  onChange={(e) => handleUpdateChange('title', e.target.value)}
                ></TextField>

                <TextField
                  placeholder='Description'
                  fullWidth
                  label='Description'
                  value={selectedActivity.desc}
                  onChange={e => handleUpdateChange('desc', e.target.value)}
                ></TextField>
              </div>

              <Button variant='contained' color='success' onClick={handleActUpdate}>Update</Button>
            </Box>
          </Modal>

          <Typography variant='h6'>Subject Marks Distribution</Typography>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Term</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={term}
              onChange={e => setTerm(e.target.value)}
            >
              <FormControlLabel value={1} control={<Radio />} label="1st Term" />
              <FormControlLabel value={2} control={<Radio />} label="2nd Term" />
              <FormControlLabel value={3} control={<Radio />} label="3rd Term" />
            </RadioGroup>
          </FormControl>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="marks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </> : <Loader />
      }
    </div>
  )
}

export default MySubject;
