import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonAlert,
  IonText,
  IonImg
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getIncidents, saveIncident, deleteAllIncidents } from '../storage'; // Asegúrate de importar correctamente

const Home: React.FC = () => {
  const [view, setView] = useState('home'); // Controla la vista actual
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const fetchIncidents = async () => {
    const incidents = await getIncidents();
    setIncidents(incidents);
  };

  useEffect(() => {
    if (view === 'list') {
      fetchIncidents();
    }
  }, [view]);

  const handleRegister = async () => {
    const photoUrl = photo ? URL.createObjectURL(photo) : '';
    const audioUrl = audio ? URL.createObjectURL(audio) : '';
    const incident = { title, date, description, photo: photoUrl, audio: audioUrl };
    await saveIncident(incident);
    setTitle('');
    setDate(undefined);
    setDescription('');
    setPhoto(null);
    setAudio(null);
    setView('list'); // Cambia a la vista de lista después de guardar
  };

  const handleDeleteAll = async () => {
    await deleteAllIncidents();
    setIncidents([]);
  };

  if (view === 'home') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <center><IonTitle>Inicio</IonTitle></center>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonButton expand="full" onClick={() => setView('register')}>
            Registrar Incidencia
          </IonButton>
          <IonButton expand="full" onClick={() => setView('list')}>
            Ver Incidencias
          </IonButton>
          <IonButton expand="full" onClick={() => setView('about')}>
            Acerca de
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (view === 'register') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Registrar Incidencia</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ padding: '16px' }}>
            <IonInput
              placeholder="Título"
              value={title}
              onIonChange={(e: CustomEvent) => setTitle((e.target as HTMLInputElement).value)}
              style={{ marginBottom: '16px' }}
            />
            <IonModal keepContentsMounted={true}>
              <IonDatetime
                id="datetime"
                presentation="date"
                value={date}
                onIonChange={(e: CustomEvent) => setDate(e.detail.value)}
              ></IonDatetime>
            </IonModal>
            <IonTextarea
              placeholder="Descripción"
              value={description}
              onIonChange={(e: CustomEvent) => setDescription((e.target as HTMLTextAreaElement).value)}
              style={{ marginBottom: '16px' }}
            />
            <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
            <label htmlFor="photo">Imagen:</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
              style={{ display: 'block', marginBottom: '16px' }}
            />
            <label htmlFor="audio">Audio:</label>
            <input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => setAudio(e.target.files ? e.target.files[0] : null)}
              style={{ display: 'block', marginBottom: '16px' }}
            />
            <IonButton onClick={handleRegister}>Guardar</IonButton>
            <IonButton onClick={() => setView('home')}>Volver</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (view === 'list') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Lista de Incidencias</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {incidents.map((incident, index) => (
              <IonItem
                key={index}
                style={{ marginBottom: '16px' }}
              >
                <IonLabel>
                  <h2>{incident.title}</h2>
                  <p>{incident.date}</p>
                  <p>{incident.description}</p>
                  {incident.photo && (
                    <IonImg
                      src={incident.photo}
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        marginBottom: '8px'
                      }}
                    />
                  )}
                  {incident.audio && (
                    <audio
                      controls
                      src={incident.audio}
                      style={{ display: 'block', marginTop: '8px' }}
                    />
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
          <IonButton expand="full" color="danger" onClick={() => setShowAlert(true)}>Eliminar Todos los Registros</IonButton>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Confirmar'}
            message={'¿Estás seguro de que quieres eliminar todos los registros? Esta acción no se puede deshacer.'}
            buttons={[
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => console.log('Cancelado'),
              },
              {
                text: 'Eliminar',
                handler: handleDeleteAll,
              }
            ]}
          />
          <IonButton onClick={() => setView('home')}>Volver</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (view === 'detail') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalles de la Incidencia</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {/* Aquí debes colocar la lógica para mostrar los detalles del incidente */}
          <h2>Detalles del Incidente</h2>
          {/* Suponiendo que ya tienes una forma de seleccionar el incidente a mostrar */}
          <IonButton onClick={() => setView('list')}>Volver</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (view === 'about') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Acerca de</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '16px'
          }}>
            <img 
              src="src/assets/yo.jpg" 
              alt="Oficial" 
              style={{ 
                width: '150px', 
                height: 'auto', 
                borderRadius: '50%', 
                marginBottom: '16px' 
              }} 
            />
            <h2>COMANDANTE</h2>
            <p>Nombre: Jose Luis </p>
            <p>Apellido: Acevedo Mendez</p>
            <p>Matrícula: 2022-0447</p>
            <p>Moraleja: "La justicia lo es todo"</p>
            <IonButton onClick={() => setView('home')}>Volver</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return null; // O cualquier otro fallback
};

export default Home;
