import { Footer } from '@containers/layouts/Footer';
import { Header } from '@containers/layouts/Header/Header';
import { FooterPlace } from '@enums/containers';

export const HOST_MAIN_HEADER = <Header />;

export const HOST_MAIN_FOOTER = <Footer place={FooterPlace.Global} sx={{ display: { xs: 'none', sm: 'flex' } }} />;
