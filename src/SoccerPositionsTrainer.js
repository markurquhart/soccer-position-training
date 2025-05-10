import React, { useState, useEffect, useRef } from 'react';

const SoccerPositionsTrainer = () => {
  // State for user configurations
  const [ageGroup, setAgeGroup] = useState('u10');
  const [formation, setFormation] = useState('4-4-2');
  const [playerCount, setPlayerCount] = useState(11);
  const [ballPosition, setBallPosition] = useState('attacking');
  const [showIntro, setShowIntro] = useState(true);
  const [ballCoords, setBallCoords] = useState({ x: 50, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const fieldRef = useRef(null);
  
  // Define formations based on age groups and player counts
  const formations = {
    u8: {
      7: ['3-3', '2-3-1', '2-1-3'],
      9: ['3-2-3', '3-3-2', '2-3-3']
    },
    u10: {
      7: ['3-3', '2-3-1', '2-1-3'],
      9: ['3-2-3', '3-3-2', '2-3-3'],
      11: ['4-4-2', '4-3-3', '3-5-2']
    },
    u12: {
      9: ['3-2-3', '3-3-2', '2-3-3'],
      11: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1']
    },
    u14: {
      11: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '3-4-3']
    },
    u16: {
      11: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '3-4-3', '4-1-4-1']
    }
  };

  // Strategy library - basic movement patterns based on ball position
  const strategies = {
    '4-4-2': {
      attacking: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Stay alert, prepare for counterattacks' },
          { id: 2, role: 'RB', x: 20, y: 75, notes: 'Move forward to provide width' },
          { id: 3, role: 'CB', x: 40, y: 85, notes: 'Stay back to prevent counterattacks' },
          { id: 4, role: 'CB', x: 60, y: 85, notes: 'Stay back to prevent counterattacks' },
          { id: 5, role: 'LB', x: 80, y: 75, notes: 'Move forward to provide width' },
          { id: 6, role: 'RM', x: 25, y: 55, notes: 'Move wide to create space' },
          { id: 7, role: 'CM', x: 40, y: 60, notes: 'Support attack, be ready for through balls' },
          { id: 8, role: 'CM', x: 60, y: 60, notes: 'Support attack, be ready for through balls' },
          { id: 9, role: 'LM', x: 75, y: 55, notes: 'Move wide to create space' },
          { id: 10, role: 'ST', x: 40, y: 30, notes: 'Make runs behind defense' },
          { id: 11, role: 'ST', x: 60, y: 30, notes: 'Make runs behind defense' }
        ]
      },
      defending: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Communicate with defenders' },
          { id: 2, role: 'RB', x: 25, y: 85, notes: 'Stay compact with defensive line' },
          { id: 3, role: 'CB', x: 40, y: 90, notes: 'Stay central, mark strikers' },
          { id: 4, role: 'CB', x: 60, y: 90, notes: 'Stay central, mark strikers' },
          { id: 5, role: 'LB', x: 75, y: 85, notes: 'Stay compact with defensive line' },
          { id: 6, role: 'RM', x: 30, y: 70, notes: 'Track back to help defense' },
          { id: 7, role: 'CM', x: 40, y: 75, notes: 'Screen passes to opposing forwards' },
          { id: 8, role: 'CM', x: 60, y: 75, notes: 'Screen passes to opposing forwards' },
          { id: 9, role: 'LM', x: 70, y: 70, notes: 'Track back to help defense' },
          { id: 10, role: 'ST', x: 40, y: 60, notes: 'Apply light pressure, prepare for counter' },
          { id: 11, role: 'ST', x: 60, y: 60, notes: 'Apply light pressure, prepare for counter' }
        ]
      },
      transition: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Look for quick distribution options' },
          { id: 2, role: 'RB', x: 25, y: 80, notes: 'Move into wide positions' },
          { id: 3, role: 'CB', x: 40, y: 85, notes: 'Stay back, provide passing option' },
          { id: 4, role: 'CB', x: 60, y: 85, notes: 'Stay back, provide passing option' },
          { id: 5, role: 'LB', x: 75, y: 80, notes: 'Move into wide positions' },
          { id: 6, role: 'RM', x: 25, y: 65, notes: 'Sprint wide for outlet pass' },
          { id: 7, role: 'CM', x: 45, y: 70, notes: 'Move to open space for pass' },
          { id: 8, role: 'CM', x: 55, y: 70, notes: 'Move to open space for pass' },
          { id: 9, role: 'LM', x: 75, y: 65, notes: 'Sprint wide for outlet pass' },
          { id: 10, role: 'ST', x: 45, y: 45, notes: 'Make run into channel' },
          { id: 11, role: 'ST', x: 55, y: 45, notes: 'Make run into channel' }
        ]
      }
    },
    '4-3-3': {
      attacking: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Stay alert, prepare for counterattacks' },
          { id: 2, role: 'RB', x: 20, y: 75, notes: 'Provide width in attack' },
          { id: 3, role: 'CB', x: 40, y: 85, notes: 'Stay back, maintain defensive shape' },
          { id: 4, role: 'CB', x: 60, y: 85, notes: 'Stay back, maintain defensive shape' },
          { id: 5, role: 'LB', x: 80, y: 75, notes: 'Provide width in attack' },
          { id: 6, role: 'CDM', x: 50, y: 70, notes: 'Stay central, shield defense' },
          { id: 7, role: 'CM', x: 35, y: 60, notes: 'Support attack, look for through balls' },
          { id: 8, role: 'CM', x: 65, y: 60, notes: 'Support attack, look for through balls' },
          { id: 9, role: 'RW', x: 25, y: 40, notes: 'Stay wide, cut inside when possible' },
          { id: 10, role: 'ST', x: 50, y: 30, notes: 'Make central runs, look for crosses' },
          { id: 11, role: 'LW', x: 75, y: 40, notes: 'Stay wide, cut inside when possible' }
        ]
      },
      defending: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Communicate with defenders' },
          { id: 2, role: 'RB', x: 25, y: 85, notes: 'Stay compact with defensive line' },
          { id: 3, role: 'CB', x: 40, y: 90, notes: 'Mark strikers, organize defense' },
          { id: 4, role: 'CB', x: 60, y: 90, notes: 'Mark strikers, organize defense' },
          { id: 5, role: 'LB', x: 75, y: 85, notes: 'Stay compact with defensive line' },
          { id: 6, role: 'CDM', x: 50, y: 75, notes: 'Screen passes to opposing attackers' },
          { id: 7, role: 'CM', x: 35, y: 70, notes: 'Press opposition midfielders' },
          { id: 8, role: 'CM', x: 65, y: 70, notes: 'Press opposition midfielders' },
          { id: 9, role: 'RW', x: 30, y: 60, notes: 'Track back to help defense' },
          { id: 10, role: 'ST', x: 50, y: 60, notes: 'Apply pressure to center backs' },
          { id: 11, role: 'LW', x: 70, y: 60, notes: 'Track back to help defense' }
        ]
      },
      transition: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Look for quick distribution options' },
          { id: 2, role: 'RB', x: 25, y: 80, notes: 'Move forward to provide width' },
          { id: 3, role: 'CB', x: 40, y: 85, notes: 'Stay back, provide passing option' },
          { id: 4, role: 'CB', x: 60, y: 85, notes: 'Stay back, provide passing option' },
          { id: 5, role: 'LB', x: 75, y: 80, notes: 'Move forward to provide width' },
          { id: 6, role: 'CDM', x: 50, y: 75, notes: 'Distribute ball quickly' },
          { id: 7, role: 'CM', x: 40, y: 65, notes: 'Move to open space for pass' },
          { id: 8, role: 'CM', x: 60, y: 65, notes: 'Move to open space for pass' },
          { id: 9, role: 'RW', x: 25, y: 45, notes: 'Sprint wide for outlet pass' },
          { id: 10, role: 'ST', x: 50, y: 40, notes: 'Make run in behind defense' },
          { id: 11, role: 'LW', x: 75, y: 45, notes: 'Sprint wide for outlet pass' }
        ]
      }
    },
    '3-5-2': {
      attacking: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Stay alert, prepare for counterattacks' },
          { id: 2, role: 'CB', x: 30, y: 85, notes: 'Stay back, maintain defensive shape' },
          { id: 3, role: 'CB', x: 50, y: 85, notes: 'Stay back, organize defense' },
          { id: 4, role: 'CB', x: 70, y: 85, notes: 'Stay back, maintain defensive shape' },
          { id: 5, role: 'RWB', x: 15, y: 65, notes: 'Provide width, overlap when possible' },
          { id: 6, role: 'LWB', x: 85, y: 65, notes: 'Provide width, overlap when possible' },
          { id: 7, role: 'CM', x: 35, y: 60, notes: 'Support attack, cover for wingbacks' },
          { id: 8, role: 'CDM', x: 50, y: 70, notes: 'Stay central, shield defense' },
          { id: 9, role: 'CM', x: 65, y: 60, notes: 'Support attack, cover for wingbacks' },
          { id: 10, role: 'ST', x: 40, y: 30, notes: 'Make runs in behind, look for crosses' },
          { id: 11, role: 'ST', x: 60, y: 30, notes: 'Make runs in behind, look for crosses' }
        ]
      },
      defending: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Communicate with defenders' },
          { id: 2, role: 'CB', x: 30, y: 90, notes: 'Mark strikers, maintain back three' },
          { id: 3, role: 'CB', x: 50, y: 90, notes: 'Organize defense, cover central area' },
          { id: 4, role: 'CB', x: 70, y: 90, notes: 'Mark strikers, maintain back three' },
          { id: 5, role: 'RWB', x: 20, y: 80, notes: 'Track back to form back five' },
          { id: 6, role: 'LWB', x: 80, y: 80, notes: 'Track back to form back five' },
          { id: 7, role: 'CM', x: 35, y: 75, notes: 'Press opposition midfielders' },
          { id: 8, role: 'CDM', x: 50, y: 80, notes: 'Screen passes to opposing attackers' },
          { id: 9, role: 'CM', x: 65, y: 75, notes: 'Press opposition midfielders' },
          { id: 10, role: 'ST', x: 40, y: 60, notes: 'Apply light pressure, prepare for counter' },
          { id: 11, role: 'ST', x: 60, y: 60, notes: 'Apply light pressure, prepare for counter' }
        ]
      },
      transition: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Look for quick distribution options' },
          { id: 2, role: 'CB', x: 30, y: 85, notes: 'Stay back, provide passing option' },
          { id: 3, role: 'CB', x: 50, y: 85, notes: 'Stay back, organize transition' },
          { id: 4, role: 'CB', x: 70, y: 85, notes: 'Stay back, provide passing option' },
          { id: 5, role: 'RWB', x: 15, y: 70, notes: 'Sprint wide for outlet pass' },
          { id: 6, role: 'LWB', x: 85, y: 70, notes: 'Sprint wide for outlet pass' },
          { id: 7, role: 'CM', x: 35, y: 65, notes: 'Move to open space for pass' },
          { id: 8, role: 'CDM', x: 50, y: 75, notes: 'Distribute ball quickly' },
          { id: 9, role: 'CM', x: 65, y: 65, notes: 'Move to open space for pass' },
          { id: 10, role: 'ST', x: 40, y: 45, notes: 'Make run into channel' },
          { id: 11, role: 'ST', x: 60, y: 45, notes: 'Make run into channel' }
        ]
      }
    },
    // For 7v7 formations
    '3-3': {
      attacking: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Stay alert, prepare for counterattacks' },
          { id: 2, role: 'RD', x: 30, y: 80, notes: 'Stay back, cover right side' },
          { id: 3, role: 'CD', x: 50, y: 85, notes: 'Stay back, organize defense' },
          { id: 4, role: 'LD', x: 70, y: 80, notes: 'Stay back, cover left side' },
          { id: 5, role: 'RM', x: 30, y: 50, notes: 'Provide width, support attack' },
          { id: 6, role: 'CM', x: 50, y: 60, notes: 'Link play between defense and attack' },
          { id: 7, role: 'LM', x: 70, y: 50, notes: 'Provide width, support attack' }
        ]
      },
      defending: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Communicate with defenders' },
          { id: 2, role: 'RD', x: 30, y: 85, notes: 'Stay compact with defensive line' },
          { id: 3, role: 'CD', x: 50, y: 90, notes: 'Mark strikers, organize defense' },
          { id: 4, role: 'LD', x: 70, y: 85, notes: 'Stay compact with defensive line' },
          { id: 5, role: 'RM', x: 35, y: 70, notes: 'Track back to help defense' },
          { id: 6, role: 'CM', x: 50, y: 75, notes: 'Screen passes to opposing attackers' },
          { id: 7, role: 'LM', x: 65, y: 70, notes: 'Track back to help defense' }
        ]
      },
      transition: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Look for quick distribution options' },
          { id: 2, role: 'RD', x: 30, y: 85, notes: 'Stay back, provide passing option' },
          { id: 3, role: 'CD', x: 50, y: 85, notes: 'Stay back, organize transition' },
          { id: 4, role: 'LD', x: 70, y: 85, notes: 'Stay back, provide passing option' },
          { id: 5, role: 'RM', x: 30, y: 60, notes: 'Move to open space for pass' },
          { id: 6, role: 'CM', x: 50, y: 70, notes: 'Distribute ball quickly' },
          { id: 7, role: 'LM', x: 70, y: 60, notes: 'Move to open space for pass' }
        ]
      }
    },
    '2-3-1': {
      attacking: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Stay alert, prepare for counterattacks' },
          { id: 2, role: 'RD', x: 35, y: 85, notes: 'Stay back, maintain defensive shape' },
          { id: 3, role: 'LD', x: 65, y: 85, notes: 'Stay back, maintain defensive shape' },
          { id: 4, role: 'RM', x: 30, y: 60, notes: 'Provide width, support attack' },
          { id: 5, role: 'CM', x: 50, y: 65, notes: 'Link play between defense and attack' },
          { id: 6, role: 'LM', x: 70, y: 60, notes: 'Provide width, support attack' },
          { id: 7, role: 'ST', x: 50, y: 35, notes: 'Make runs in behind, look for scoring opportunities' }
        ]
      },
      defending: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Communicate with defenders' },
          { id: 2, role: 'RD', x: 35, y: 85, notes: 'Stay compact with defensive line' },
          { id: 3, role: 'LD', x: 65, y: 85, notes: 'Stay compact with defensive line' },
          { id: 4, role: 'RM', x: 35, y: 70, notes: 'Track back to help defense' },
          { id: 5, role: 'CM', x: 50, y: 75, notes: 'Screen passes to opposing attackers' },
          { id: 6, role: 'LM', x: 65, y: 70, notes: 'Track back to help defense' },
          { id: 7, role: 'ST', x: 50, y: 60, notes: 'Apply light pressure, prepare for counter' }
        ]
      },
      transition: {
        playerPositions: [
          { id: 1, role: 'GK', x: 50, y: 95, notes: 'Look for quick distribution options' },
          { id: 2, role: 'RD', x: 35, y: 85, notes: 'Stay back, provide passing option' },
          { id: 3, role: 'LD', x: 65, y: 85, notes: 'Stay back, provide passing option' },
          { id: 4, role: 'RM', x: 30, y: 65, notes: 'Move to open space for pass' },
          { id: 5, role: 'CM', x: 50, y: 70, notes: 'Distribute ball quickly' },
          { id: 6, role: 'LM', x: 70, y: 65, notes: 'Move to open space for pass' },
          { id: 7, role: 'ST', x: 50, y: 45, notes: 'Make run into space' }
        ]
      }
    }
  };

  // Colors for player positions
  const playerColors = {
    GK: '#ffcc00', // Yellow
    RB: '#ff6b6b', // Red
    CB: '#ff6b6b', 
    LB: '#ff6b6b',
    RD: '#ff6b6b',
    CD: '#ff6b6b',
    LD: '#ff6b6b',
    CDM: '#6b96ff', // Blue
    CM: '#6b96ff',
    RM: '#6b96ff',
    LM: '#6b96ff',
    RW: '#6bb3ff', // Light Blue
    LW: '#6bb3ff',
    ST: '#7dff6b', // Green
    RWB: '#ff6bb8', // Pink
    LWB: '#ff6bb8',
  };

  // Effect to update formation when age group or player count changes
  useEffect(() => {
    if (formations[ageGroup] && formations[ageGroup][playerCount]) {
      setFormation(formations[ageGroup][playerCount][0]);
    }
  }, [ageGroup, playerCount, formations]);
  
  // Function to get available player counts for the selected age group
  const getAvailablePlayerCounts = () => {
    return Object.keys(formations[ageGroup] || {}).map(count => parseInt(count));
  };
  
  // Function to get available formations for the selected age group and player count
  const getAvailableFormations = () => {
    if (formations[ageGroup] && formations[ageGroup][playerCount]) {
      return formations[ageGroup][playerCount];
    }
    return [];
  };
  
  // Calculate player positions based on ball coordinates
  const calculatePlayerPositions = () => {
    if (!strategies[formation]) return [];
    
    // Get base positions based on game phase
    let basePositions = [];
    if (ballPosition === 'attacking') {
      basePositions = [...strategies[formation].attacking.playerPositions];
    } else if (ballPosition === 'defending') {
      basePositions = [...strategies[formation].defending.playerPositions];
    } else if (ballPosition === 'transition') {
      basePositions = [...strategies[formation].transition.playerPositions];
    }
    
    // Calculate dynamic positions based on ball location
    return basePositions.map(player => {
      // Clone the player object to avoid modifying the original
      const newPlayer = { ...player };
      
      // Calculate distance from ball to player
      const distance = Math.sqrt(
        Math.pow(ballCoords.x - player.x, 2) + 
        Math.pow(ballCoords.y - player.y, 2)
      );
      
      // Different roles respond differently to ball position
      if (player.role === 'GK') {
        // Goalkeeper adjusts slightly based on ball position
        newPlayer.x = 50 + (ballCoords.x - 50) * 0.1;
        
        // Update goalkeeper instructions
        if (ballCoords.y > 80) {
          newPlayer.notes = '🚨 Be ready to make a save!';
        } else if (ballCoords.y > 70) {
          newPlayer.notes = '👀 Be alert, communicate with defenders';
        } else {
          newPlayer.notes = '🔄 Be ready to sweep behind defense';
        }
      } else if (['CB', 'RB', 'LB', 'RD', 'LD', 'CD'].includes(player.role)) {
        // Defenders shift toward the ball but maintain formation
        newPlayer.x = player.x + (ballCoords.x - 50) * 0.15;
        
        // Update defender instructions based on ball position
        if (distance < 15) {
          newPlayer.notes = '🛑 Press the player with the ball!';
        } else if (ballCoords.y < 40) {
          newPlayer.notes = '⬆️ Push up to support attack';
        } else if (ballCoords.y > 70) {
          newPlayer.notes = '🔙 Get compact, mark attackers';
        } else {
          newPlayer.notes = '↔️ Shift toward ball side, maintain line';
        }
      } else if (['CM', 'CDM', 'RM', 'LM'].includes(player.role)) {
        // Midfielders are more responsive to ball movement
        newPlayer.x = player.x + (ballCoords.x - 50) * 0.25;
        
        // Vertical adjustment - midfielders move more with the ball
        if (ballCoords.y < 50) {
          newPlayer.y = player.y - (player.y - ballCoords.y) * 0.2;
        } else {
          newPlayer.y = player.y + (ballCoords.y - player.y) * 0.2;
        }
        
        // Update midfielder instructions
        if (distance < 15) {
          newPlayer.notes = '✅ Support player with the ball!';
        } else if (distance < 30) {
          newPlayer.notes = '➡️ Create a passing option';
        } else if (ballCoords.y > 70) {
          newPlayer.notes = '🛡️ Screen passes to attacking players';
        } else if (ballCoords.y < 40) {
          newPlayer.notes = '⚡ Make forward runs into space';
        } else {
          newPlayer.notes = '⬆️⬇️ Maintain shape, shift toward ball';
        }
      } else if (['ST', 'RW', 'LW'].includes(player.role)) {
        // Forwards adjust based on ball position
        if (ballCoords.y < 50) {
          // In attacking half, make forward runs
          newPlayer.x = player.x + (ballCoords.x - player.x) * 0.15;
          
          if (Math.abs(newPlayer.x - ballCoords.x) < 20) {
            newPlayer.notes = '🏃‍♂️ Make a run in behind!';
          } else {
            newPlayer.notes = '↕️ Find space between defenders';
          }
        } else {
          // In defensive half, drop back to help
          newPlayer.x = player.x + (ballCoords.x - 50) * 0.2;
          newPlayer.y = Math.min(player.y + 15, 70);
          newPlayer.notes = '🔙 Drop back to support midfield';
        }
      } else if (['RWB', 'LWB'].includes(player.role)) {
        // Wing backs are very dynamic
        if (ballCoords.y < 40) {
          // Push forward in attack
          newPlayer.y = Math.max(player.y - 15, 30);
          newPlayer.notes = '⬆️ Overlap wide, provide width';
        } else if (ballCoords.y > 70) {
          // Drop back in defense
          newPlayer.y = Math.min(player.y + 10, 80);
          newPlayer.notes = '🔙 Track back to form back 5';
        } else {
          newPlayer.notes = '⬆️⬇️ Be ready to sprint up/down';
        }
        
        // Shift toward the ball side
        newPlayer.x = player.x + (ballCoords.x - 50) * 0.15;
      }
      
      // Ensure players stay within bounds
      newPlayer.x = Math.max(5, Math.min(95, newPlayer.x));
      newPlayer.y = Math.max(5, Math.min(95, newPlayer.y));
      
      return newPlayer;
    });
  };
  
  // Function to get positions for the current scenario
  const getCurrentPositions = () => {
    return calculatePlayerPositions();
  };
  
  // Function to get field width based on player count
  const getFieldWidth = () => {
    return playerCount >= 11 ? 'w-full' : 'w-4/5';
  };
  
  // Function to handle field click for ball positioning
  const handleFieldClick = (e) => {
    const field = e.currentTarget;
    const rect = field.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Update ball position
    setBallCoords({ x, y });
    
    // Determine game phase based on field position
    if (y < 40) {
      setBallPosition('attacking');
    } else if (y > 70) {
      setBallPosition('defending');
    } else {
      setBallPosition('transition');
    }
  };
  
  // Functions for ball dragging
  const handleBallMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleBallMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add event listeners for mouse move and up to handle dragging
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleMouseMove = (e) => {
      if (isDragging && fieldRef.current) {
        const field = fieldRef.current;
        const rect = field.getBoundingClientRect();
        
        // Calculate ball position
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Constrain within field
        x = Math.max(5, Math.min(95, x));
        y = Math.max(5, Math.min(95, y));
        
        // Update ball coordinates
        setBallCoords({ x, y });
        
        // Update game phase based on field position
        if (y < 40) {
          setBallPosition('attacking');
        } else if (y > 70) {
          setBallPosition('defending');
        } else {
          setBallPosition('transition');
        }
      }
    };
    
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  return (
    <div className="bg-green-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      {showIntro ? (
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h1 className="text-2xl font-bold text-green-800 flex items-center mb-4">
            <div className="mr-2 text-green-700">⚽</div>
            Soccer Positions Trainer
          </h1>
          <p className="mb-4">
            Welcome to the Soccer Positions Trainer! This interactive tool helps young players learn where to position themselves on the field based on different game situations.
          </p>
          <h2 className="text-xl font-semibold text-green-700 mb-2">How to use this app:</h2>
          <ol className="list-decimal ml-6 mb-4 space-y-2">
            <li>Select your players' age group</li>
            <li>Choose the number of players on your team (7, 9, or 11)</li>
            <li>Pick a formation that suits your team</li>
            <li>Select a game situation (attacking, defending, or transition)</li>
            <li>Click on the field to see where players should position themselves</li>
          </ol>
          <p className="mb-4">
            The app will show you where each player should be positioned and provide notes about what they should be doing in that situation.
          </p>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setShowIntro(false)}
          >
            Get Started
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-800 flex items-center">
              <div className="mr-2 text-green-700">⚽</div>
              Soccer Positions Trainer
            </h1>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
              onClick={() => setShowIntro(true)}
            >
              Show Instructions
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ageGroup">
                Age Group
              </label>
              <select
                id="ageGroup"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
              >
                <option value="u8">Under 8</option>
                <option value="u10">Under 10</option>
                <option value="u12">Under 12</option>
                <option value="u14">Under 14</option>
                <option value="u16">Under 16</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="playerCount">
                Number of Players
              </label>
              <select
                id="playerCount"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              >
                {getAvailablePlayerCounts().map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="formation">
                Formation
              </label>
              <select
                id="formation"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
              >
                {getAvailableFormations().map(form => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-green-700 mb-2">Game Situation</h2>
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-md ${ballPosition === 'attacking' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setBallPosition('attacking');
                  setBallCoords({ x: 50, y: 30 });
                }}
              >
                Attacking
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${ballPosition === 'defending' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setBallPosition('defending');
                  setBallCoords({ x: 50, y: 75 });
                }}
              >
                Defending
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${ballPosition === 'transition' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setBallPosition('transition');
                  setBallCoords({ x: 50, y: 50 });
                }}
              >
                Transition
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Click buttons to see standard positions or drag the ball to see real-time adjustments.</p>
            </div>
          </div>
          
          <div className="relative mb-4">
            {/* Soccer Field with fixed height */}
            <div 
            ref={fieldRef}
            className={`${getFieldWidth()} mx-auto h-96 bg-green-500 rounded-lg overflow-hidden border-2 border-white relative`}
            style={{ aspectRatio: '3/4' }}
            onClick={handleFieldClick}
            >
              {/* Field markings */}
              <div className="absolute h-full w-full border-2 border-white"></div>
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full"></div>
              
              {/* Center line */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-white"></div>
              
              {/* Penalty areas */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-44 h-16 border-2 border-white border-b-0"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-44 h-16 border-2 border-white border-t-0"></div>
              
              {/* Goal areas */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-6 border-2 border-white border-b-0"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 border-2 border-white border-t-0"></div>
              
              {/* Penalty spots */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
              
              {/* Field Areas Labels */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold bg-black bg-opacity-30 px-2 py-1 rounded">
                ATTACKING THIRD
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold bg-black bg-opacity-30 px-2 py-1 rounded">
                MIDDLE THIRD
              </div>
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold bg-black bg-opacity-30 px-2 py-1 rounded">
                DEFENSIVE THIRD
              </div>
              
              {/* Player positions */}
              {getCurrentPositions().map(player => (
                <div 
                  key={player.id} 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{
                    left: `${player.x}%`,
                    top: `${player.y}%`,
                  }}
                >
                  <div 
                    className="relative w-8 h-8 rounded-full flex items-center justify-center text-black font-bold border-2 border-white"
                    style={{ backgroundColor: playerColors[player.role] || '#ffffff' }}
                  >
                    {player.id}
                    {/* Movement indicators */}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 text-xs flex items-center justify-center animate-pulse">
                      !
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-center mt-1 bg-black bg-opacity-50 text-white px-1 rounded">
                    {player.role}
                  </div>
                </div>
              ))}
              
              {/* Ball - Now draggable */}
              <div 
                className="absolute w-6 h-6 bg-white rounded-full border-2 border-black transform -translate-x-1/2 -translate-y-1/2 cursor-move flex items-center justify-center shadow-lg z-50"
                style={{
                  left: `${ballCoords.x}%`,
                  top: `${ballCoords.y}%`,
                }}
                onMouseDown={handleBallMouseDown}
                onMouseUp={handleBallMouseUp}
              >
                <span className="animate-pulse">⚽</span>
              </div>
              
              {/* Direction for dragging */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Drag the ball ⚽
              </div>
            </div>
          </div>
          
          {ballPosition && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h2 className="text-lg font-semibold text-green-700 mb-2 flex items-center">
                <span className="mr-2">
                  {ballPosition === 'attacking' ? '⚽' : ballPosition === 'defending' ? '🛡️' : '🔄'}
                </span>
                Player Instructions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentPositions().map(player => (
                  <div key={player.id} className="flex items-start p-2 rounded-md" style={{ backgroundColor: `${playerColors[player.role]}20` }}>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold border-2 border-white flex-shrink-0 mt-1"
                      style={{ backgroundColor: playerColors[player.role] || '#ffffff' }}
                    >
                      {player.id}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold">{player.role}: Player {player.id}</div>
                      <div className="text-sm text-gray-700">{player.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Tip: The players will adjust their positions automatically as you drag the ball around!</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SoccerPositionsTrainer;