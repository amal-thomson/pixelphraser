import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import LanguagesConfigured from '../components/project/languagesConfigured';

const FetchProjectLanguages = () => {
  const project = useApplicationContext((context) => context.project);

  return <LanguagesConfigured languages={project?.languages} />;
};

export default FetchProjectLanguages;
