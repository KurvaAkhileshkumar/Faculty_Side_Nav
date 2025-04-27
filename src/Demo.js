import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Tooltip, IconButton, Divider, Collapse } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

const sidebarConfig = [
  {
    label: 'Home',
    icon: '🏠',
    children: [],
  },
  {
    label: 'Teach',
    icon: 'T',
    children: [
      { label: 'Courses' },
      { label: 'Attendance' },
      { label: 'Lesson hooks', disabled: true, tooltip: 'Launching soon!' },
      { label: 'Lesson Planner', tag: 'New' },
    ],
  },
  {
    label: 'Engage',
    icon: 'E',
    children: [
      { label: 'Live Assessments' },
      { label: 'Notify' },
      { label: 'Arena' },
    ],
  },
  {
    label: 'Access',
    icon: 'A',
    children: [
      { label: 'Objective Assessments' },
      { label: 'Subjective Assessments' },
      { label: 'Coding Assessments' },
      { label: 'Assignments' },
      { label: 'Projects', disabled: true, tooltip: 'Launching soon!' },
    ],
  },
  {
    label: 'Track',
    icon: 'T',
    children: [
      { label: 'Activity tracker', tag: 'New' },
      { label: 'Reports' },
      { label: 'CO Mapping', disabled: true, tooltip: 'Launching soon!' },
      { label: 'Unit feedbacks' },
      { label: 'Semester feedbacks' },
      { label: 'Regular feedbacks' },
    ],
  },
  {
    label: 'Analyse',
    icon: 'A',
    children: [
      { label: 'Your analytics' },
      { label: 'Student analytics' },
      { label: 'Intelligent Dashboards' },
      { label: 'SWOC', tag: 'New' },
    ],
  },
  {
    label: 'Research',
    icon: 'R',
    children: [{ label: 'Remedial Actions' }, { label: 'Research Summariser' }],
  },
  {
    label: 'Manage',
    icon: '🧩',
    children: [
      { label: 'Course Allocations' },
      { label: 'Your Profile' },
      { label: 'Student Profile' },
      { label: 'Integrations' },
    ],
  },
];

export default function Sidebar() {
  const [hovered, setHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState('');
  const [selectedItem, setSelectedItem] = useState('Home');
  const [selectedChildItem, setSelectedChildItem] = useState('');

  const handleItemClick = (label, hasChildren) => {
    if (!hasChildren) {
      setSelectedItem(label);
      setSelectedChildItem(null);
    }
  };

  const handleChildClick = (parent, child) => {
    setSelectedItem(parent);
    setSelectedChildItem(child);
  };

  // Adjust the transition duration for faster expand/collapse
  const handleExpandCollapse = (label) => {
    if (hoveredItem === label) {
      setHoveredItem('');
    } else {
      setHoveredItem(label);
    }
  };

  // Find the current selected child item object if any
  const getSelectedChildItemObject = () => {
    const parent = sidebarConfig.find(section => section.label === selectedItem);
    if (parent && selectedChildItem) {
      return parent.children.find(child => child.label === selectedChildItem);
    }
    return null;
  };

  const selectedChild = getSelectedChildItemObject();

  // Check if a parent has a selected child
  const hasSelectedChild = (parentLabel) => {
    return parentLabel === selectedItem && selectedChildItem;
  };

  return (
    <Box
      component={motion.div}
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.1, ease: 'easeInOut' }}
      sx={{
        width: 260,
        height: '100vh',
        backgroundColor: '#f9f9f9',
        overflowX: 'hidden',
        borderRight: '1px solid #ddd',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <List>
        {sidebarConfig.map((section) => {
          const isHovered = hoveredItem === section.label;
          const isSelected = selectedItem === section.label;
          const hasChildren = section.children.length > 0;
          const showChildren = isHovered && hasChildren;

          return (
            <Box 
              key={section.label}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
            >
              <ListItem
                onClick={() => {
                  handleExpandCollapse(section.label);
                  handleItemClick(section.label, hasChildren);
                }}
                sx={{
                  backgroundColor: isSelected && !selectedChildItem ? '#e0e0e0' : 'transparent',
                  cursor: 'pointer',
                  px: 2,
                  py: 1,
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#333' : '#e0e0e0',
                      color: isSelected ? 'white' : 'black',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {section.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText primary={section.label} />
                {hasChildren && showChildren && (
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ExpandMoreIcon />
                  </Box>
                )}
                {hasChildren && !showChildren && hasSelectedChild(section.label) && (
                  <Box sx={{ marginLeft: 'auto' }}>
                    <ChevronRightIcon />
                  </Box>
                )}
              </ListItem>

              {/* Show all children when hovered with left divider */}
              {showChildren && (
                <Collapse
                  in={showChildren}
                  timeout={500} // Faster transition
                  unmountOnExit
                  component={motion.div}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.1, ease: 'easeInOut' }}
                  sx={{ position: 'relative', zIndex: 1, marginTop: 1 }} // Added marginTop to avoid overlap
                >
                  <Box sx={{ paddingLeft: 3 }}>
                    {section.children.map((item) => {
                      const isActiveChild = selectedChildItem === item.label && selectedItem === section.label;
                      
                      return (
                        <Box
                          key={item.label}
                          onClick={() =>
                            !item.disabled && handleChildClick(section.label, item.label)
                          }
                          component={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.1, ease: 'easeInOut' }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            pl: 3,
                            py: 1.5,                            
                            cursor: item.disabled ? 'not-allowed' : 'pointer',
                            mx: 1,
                            borderRadius: '4px',
                            position: 'relative',
                            zIndex: 2,
                            transition: 'background-color 0.1s ease',
                            '&:hover': {
                              backgroundColor: '#f0f0f0',
                            },
                          }}
                        >
                          {isActiveChild && (
                            <Box
                              sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: 3,                                
                                borderRadius: '4px',
                                backgroundColor: '#333',
                              }}
                            />
                          )}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              flexGrow: 1,
                              fontWeight: isActiveChild ? 'bold' : 'normal',
                            }}
                          >
                            {item.label}
                          </Typography>

                          {item.tag === 'New' && (
                            <Typography sx={{ fontSize: '10px', color: 'purple', ml: 1 }}>
                              New
                            </Typography>
                          )}

                          {item.tooltip && (
                            <Tooltip title={item.tooltip} placement="right">
                              <IconButton size="small" disabled>
                                <InfoOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Collapse>
              )}

              {/* Show only selected child when not hovered */}
              {isSelected && selectedChildItem && !showChildren && (
                <Box sx={{ paddingLeft: 3, position: 'relative' }}>
                  {/* Left divider for selected child only view */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      left: 20,
                      top: 0,
                      bottom: 0,
                      width: 1,                      
                      zIndex: 1,
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      pl: 3,
                      py: 1.5,
                      mx: 1,
                      bgcolor: '#f2f2f2',
                      borderRadius: '4px',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: 3,
                        backgroundColor: '#333',
                        borderRadius: '4px',
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        flexGrow: 1,
                        fontWeight: 'bold',
                      }}
                    >
                      {selectedChildItem}
                    </Typography>

                    {selectedChild?.tag === 'New' && (
                      <Typography sx={{ fontSize: '10px', color: 'purple', ml: 1 }}>
                        New
                      </Typography>
                    )}

                    {selectedChild?.tooltip && (
                      <Tooltip title={selectedChild.tooltip} placement="right">
                        <IconButton size="small" disabled>
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </List>

      {/* Bottom Items */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
          px: 2,
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1, ease: 'easeInOut' }}
      >
        <ListItem sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            <InfoOutlinedIcon />
          </ListItemIcon>
          {hovered && <ListItemText primary="Help" />}
        </ListItem>
        <ListItem sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#FF6B6B',
              }}
            />
          </ListItemIcon>
          {hovered && (
            <ListItemText
              primary={<Typography color="error">Logout</Typography>}
            />
          )}
        </ListItem>
      </Box>
    </Box>
  );
}