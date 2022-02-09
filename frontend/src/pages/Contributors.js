import React from "react";
import ModalContainer from "../components/ModalContainer";
import WithoutPhoto from "../assets/contributors/without-photo.svg"
import AlexSandyPentland from "../assets/contributors/Alex-Sandy-Pentland.png"
import AnnikaSougstag from "../assets/contributors/Annika-Sougstad.png"
import DanCalacci from "../assets/contributors/Dan-Calacci.png"
import JenniferWang from "../assets/contributors/Jennifer-Wang.png"
import JustinAnderson from "../assets/contributors/Justin-Anderson.png"
import LeonardoGomes from "../assets/contributors/Leonardo-Gomes.png"
import MirandaZhu from "../assets/contributors/Miranda-Zhu.png"
import MohsenBahrami from "../assets/contributors/Mohsen-Bahrami.png"
import MorganFrank from "../assets/contributors/Morgan-Frank.png"
import PriscillaWong from "../assets/contributors/Priscilla-Wong.png"
import ThomasHardjono from "../assets/contributors/Thomas-Hardjono.png"

const image = {
  WithoutPhoto: WithoutPhoto,
  AlexSandyPentland: AlexSandyPentland,
  AnnikaSougstag: AnnikaSougstag,
  DanCalacci: DanCalacci,
  JenniferWang: JenniferWang,
  JustinAnderson: JustinAnderson,
  LeonardoGomes: LeonardoGomes,
  MirandaZhu: MirandaZhu,
  MohsenBahrami: MohsenBahrami,
  MorganFrank: MorganFrank,
  PriscillaWong: PriscillaWong,
  ThomasHardjono: ThomasHardjono,
}

const styles = {
  // Undo all of the styling Mapbox forces on <ul> elements
  container: {
    margin: '30px 0px',
  },
  title: {
    fontSize: '20px',
    marginTop: '45px',
    marginBottom: '35px',
  },
  content: {
    display: "flex",
    justifyContent: "center"
  },
  contentImage: {
    width: '200px',
    height: '200px',
  },
  image: {
    borderRadius: '10px',
  },
  contentIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '200px',
    height: '200px',
    borderRadius: '10px',
    border: '3px black solid'
  },
  icon: {
    height: '120px',
  },
  text: {
    fontSize: '16px',
    margin: '0px',
    textAlign: 'center',
  },
  contentText: {
    marginTop: '10px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
  },
  boxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '35px 90px',
  }
}

const main_contributors = [
  {
    name: "Mohsen Bahrami",
    position: "Lead Researcher",
    organization: "MIT",
    link: 'https://connection.mit.edu/mohsen-bahrami'
  },
  {
    name: "Alex Sandy Pentland",
    position: "Principal Investigator",
    organization: "MIT",
    link: 'https://connection.mit.edu/alex-sandy-pentland'
  },
  {
    name: "Justin Anderson",
    position: "Lead Software Developer",
    organization: "MIT",
    link: 'https://connection.mit.edu/justin-anderson'
  },
  {
    name: "Thomas Hardjono",
    position: "Principal Investigator",
    organization: "MIT",
    link: 'https://connection.mit.edu/thomas-hardjono'
  }
]

const researchers = [
  {
    name: "Dan Calacci",
    organization: "MIT",
    link: 'https://connection.mit.edu/dan-calacci'
  },
  {
    name: "Morgan Frank",
    organization: "MIT",
    link: 'https://connection.mit.edu/morgan-frank'
  },
  {
    name: "Annika Sougstad",
    organization: "MIT",
  },
  {
    name: "Federico Ramirez",
    organization: "MIT",
  },
  {
    name: "Tobin South",
    organization: "MIT",
  },
  {
    name: "Yilun Xu",
    organization: "The University of Chicago",
  },
  {
    name: "Audrey Lin",
    organization: "Wellesley College",
  }
]

const developers = [
  {
    name: "Jennifer Wang",
    organization: "MIT",
  },
  {
    name: "Priscilla Wong",
    organization: "MIT",
  },
  {
    name: "Leonardo Gomes",
    organization: "University of Brasilia",
  },
  {
    name: "Miranda Zhu",
    organization: "Wellesley College",
  },
  {
    name: "Maita Navarro",
    organization: "Wellesley College",
  },
]

const Contributors = () => {
  return (
    <ModalContainer title="Contributors">

      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.boxGrid}>
            {main_contributors.map((main_contributor, id) => {
              var imageName = main_contributor.name.replace(" ", "")
              imageName = imageName.replace("\"", "")
              imageName = imageName.replace(" ", "")

              return (
                <div key={id} >
                  <div style={styles.contentImage}><img src={image[imageName]} alt={main_contributor.name} style={styles.image} /></div>
                  <div style={styles.contentText}>
                    { main_contributor.link ?
                      <a style={styles.text} href={main_contributor.link} >{main_contributor.name}</a> :
                      <p style={styles.text} >{main_contributor.name}</p>
                    }
                    <p style={styles.text}><b>{main_contributor.position}</b></p>
                    <p style={styles.text}>{main_contributor.organization}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <h2 style={styles.title}>Researchers:</h2>

        <div style={styles.content}>
          <div style={styles.boxGrid}>
            {researchers.map((researcher, id) => {
              var imageName = researcher.name.replace(" ", "")
              imageName = imageName.replace("\"", "")
              imageName = imageName.replace(" ", "")
              
              return (
              <div key={id} >
                { image[imageName] ? 
                  <div style={styles.contentImage}><img src={image[imageName]} alt={researcher.name} style={styles.image} /></div> : 
                  <div style={styles.contentIcon}><img src={image["WithoutPhoto"]} alt={researcher.name} style={styles.icon} /></div>}
                <div style={styles.contentText}>
                  { researcher.link ?
                    <a style={styles.text} href={researcher.link} >{researcher.name}</a> :
                    <p style={styles.text} >{researcher.name}</p>
                  }
                  <p style={styles.text}><b>{researcher.position}</b></p>
                  <p style={styles.text}>{researcher.organization}</p>
                </div>
              </div>
              )
            })}
          </div>
        </div>

        <h2 style={styles.title}>Developers:</h2>

        <div style={styles.content}>
          <div style={styles.boxGrid}>
            {developers.map((developer, id) => {
              var imageName = developer.name.replace(" ", "")
              imageName = imageName.replace("\"", "")
              imageName = imageName.replace(" ", "")

              return (
              <div key={id} > 
                { image[imageName] ? 
                  <div style={styles.contentImage}><img src={image[imageName]} alt={developer.name} style={styles.image} /></div> : 
                  <div style={styles.contentIcon}><img src={image["WithoutPhoto"]} alt={developer.name} style={styles.icon} /></div>}
                <div style={styles.contentText}>
                  { developer.link ?
                    <a style={styles.text} href={developer.link} >{developer.name}</a> :
                    <p style={styles.text} >{developer.name}</p>
                  }
                  <p style={styles.text}><b>{developer.position}</b></p>
                  <p style={styles.text}>{developer.organization}</p>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </div>
    </ModalContainer>
  )
}

export default Contributors;
