import { View, Text, FlatList } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: 'Atelier' | 'Conference' | 'Rencontre';
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conference IA', categorie: 'Conference', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Securte', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Decouverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

type Mode = 'tous' | 'ateliers';

const mode: Mode = 'tous';

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

type Statut = 'Complet' | 'Presque complet' | 'Ouvert';

function statutEvenement(e: Evenement): Statut {
  const s = placesRestantes(e);

  if (s === 0) {
    return 'Complet';
  } else if (s <= 3) {
    return 'Presque complet';
  } else {
    return 'Ouvert';
  }
}

function calculerIndicateurs(liste: Evenement[]) {
  const total = liste.length;
  const complets = liste.filter((e) => statutEvenement(e) === 'Complet').length;
  const avecPlaces = liste.filter((e) => placesRestantes(e) > 0).length;
  const totalPlaces = liste.reduce((somme, e) => somme + placesRestantes(e), 0);
  return { total, complets, avecPlaces, totalPlaces };
}

function ateliersDisponibles(liste: Evenement[]): Evenement[] {
  return liste.filter((e) => e.categorie === 'Atelier' && placesRestantes(e) > 0);
}

type BadgeEtatProps = { statut: Statut };

function BadgeEtat({ statut }: BadgeEtatProps) {
  let fond = '#DCFCE7';
  let couleurTexte = '#15803D';

  if (statut === 'Complet') {
    fond = '#FDE2E2';
    couleurTexte = '#B42318';
  } else if (statut === 'Presque complet') {
    fond = '#FFEDD5';
    couleurTexte = '#C2410C';
  }

  return (
    <View style={{
      backgroundColor: fond,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
      alignSelf: 'flex-start',
      flexShrink: 0
    }}>
      <Text style={{ color: couleurTexte, fontWeight: 'bold' }}>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const r = placesRestantes(evenement);

  let textePlaces = '';
  if (r === 0) {
    textePlaces = 'Aucune place libre';
  } else if (r === 1) {
    textePlaces = '1 place libre';
  } else {
    textePlaces = r + ' places libres';
  }

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      padding: 15,
      marginBottom: 10,
      borderRadius: 10
    }}>
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 17 , flexShrink: 1}}>
          {evenement.titre}
        </Text>
        <Text>Catégorie : {evenement.categorie}</Text>
        <Text>{textePlaces}</Text>
      </View>

      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

type BlocStatistiqueProps = { libelle: string; valeur: number };

function BlocStatistique({ libelle, valeur }: BlocStatistiqueProps) {
  return (
    <View style={{
      flexGrow: 1,
      flexBasis: '45%',
      backgroundColor: '#E6EEFC',
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center'
    }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#00225E' }}>{valeur}</Text>
      <Text style={{ fontSize: 12, color: '#2F4B85' }}>{libelle}</Text>
    </View>
  );
}

export default function App() {
  const stats = calculerIndicateurs(evenements);

  let liste = evenements;
  let titreMode = 'Tous les evenements';
  if (mode === 'ateliers') {
    liste = ateliersDisponibles(evenements);
    titreMode = 'Ateliers disponibles';
  }

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#F4F7FC' }}>

      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        CampusAgenda
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 15 }}>
        Événements du campus
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 }}>
        <BlocStatistique libelle="Evenements" valeur={stats.total} />
        <BlocStatistique libelle="Complets" valeur={stats.complets} />
        <BlocStatistique libelle="Avec des places" valeur={stats.avecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={stats.totalPlaces} />
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        {titreMode}
      </Text>

      <FlatList
        data={liste}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 24 }}>
            Aucun événement à afficher pour le moment.
          </Text>
        }
      />

    </View>
  );
}