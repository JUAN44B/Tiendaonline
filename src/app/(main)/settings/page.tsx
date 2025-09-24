import { PageHeader } from "@/components/page-header";
import SettingsForm from "@/components/settings/settings-form";
import { getCompanyData } from "@/lib/data";

export default async function SettingsPage() {
    const companyData = await getCompanyData();

    return (
        <div>
            <PageHeader 
                title="Configuración" 
                description="Actualiza la información de tu empresa para los tickets." 
            />
            <SettingsForm companyData={companyData} />
        </div>
    );
}
