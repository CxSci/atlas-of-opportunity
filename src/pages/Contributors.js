import React from "react";

import ModalContainer from "../components/ModalContainer";

const styles = {
  // Undo all of the styling Mapbox forces on <ul> elements
  ul: {
    margin: 'revert',
    padding: 'revert',
    listStyle: 'initial',
  },
}

const Contributors = () => (
  <ModalContainer title="Contributors">
    <ul style={styles.ul}>
      <li><a href="https://connection.mit.edu/alex-sandy-pentland" target="_blank" rel="noopener noreferrer">Alex &quot;Sandy&quot; Pentland</a></li>
      <li><a href="https://connection.mit.edu/thomas-hardjono" target="_blank" rel="noopener noreferrer">Thomas Hardjono</a></li>
      <li><a href="https://connection.mit.edu/mohsen-bahrami" target="_blank" rel="noopener noreferrer">Mohsen Bahrami</a></li>
      <li><a href="https://connection.mit.edu/justin-anderson" target="_blank" rel="noopener noreferrer">Justin Anderson</a></li>
      <li><a href="https://connection.mit.edu/dan-calacci" target="_blank" rel="noopener noreferrer">Dan Calacci</a></li>
      <li><a href="https://connection.mit.edu/morgan-frank" target="_blank" rel="noopener noreferrer">Morgan Frank</a></li>
      <li>Annika Sougstad</li>
      <li>Audrey Lin</li>
      <li>Federico Ramirez</li>
      <li>Jennifer Wang</li>
      <li>Leonardo Gomez</li>
      <li>Maita Navarro</li>
      <li>Miranda Zhu</li>
      <li>Priscilla Wong</li>
      <li>Tobin South</li>
      <li>Yilun Xu</li>
    </ul>
  </ModalContainer>
);

export default Contributors;
