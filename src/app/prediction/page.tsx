'use client'
import AppBarComponent from "@/app/components/AppBarComponent";
import {useState} from "react";
import {Button, Dropdown} from "semantic-ui-react";
import _ from "lodash";
import {Mutation} from "@prisma/client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding} from '@fortawesome/free-solid-svg-icons'
import {faHouse} from "@fortawesome/free-solid-svg-icons/faHouse";


/**
 * The main component for the Prediction page.
 */
export default function Prediction() {

    /**
     * Fetches addresses based on the search string.
     * @param {string} search - The search string.
     */
    const fetchAddresses = (search: string) => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                search: search
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }

        /**
         * Fetches data from the "api/locations" endpoint.
         * Processes the response and sets the addressesSearchOptions state.
         */
        fetch("api/locations", options)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Problem with the request')
                }
            })
            .then(result => {
                if (_.isEmpty(result)) {
                    // This will remove previous search results
                    setAddressesSearchOptions([])
                } else {
                    const addOptions = _.chain(result as {
                        results: {
                            numero: string,
                            nom_voie: string,
                            code_postal: string,
                            nom_commune: string,
                            geolocalisation_adresse: { lat: number, long: number }
                        }[]
                    }).get('results').map((add, index) => ({
                        key: index,
                        text: `${add.numero} ${add.nom_voie}, ${add.code_postal} ${add.nom_commune}`,
                        value: JSON.stringify(add)
                    })).value()
                    setAddressesSearchOptions(addOptions)
                }
            })

            .catch(error => console.log('error', error));
    }

    /**
     * Type definition for the AdresseOption object.
     */
    type AdresseOption = {
        key: number,
        text: string,
        value: string,
    }

    /**
     * State for storing the address search options.
     */
    const [addressesSearchOptions, setAddressesSearchOptions] = useState([] as AdresseOption[])

    /**
     * State for storing the selected address.
     */
    const [selectedAddress, setSelectedAddress] = useState(Object)

    /**
     *
     */
    const [steps, setSteps] = useState(0)

    /**
     * State for storing the mutation data.
     */
    const [mutation, setMutation] = useState({
        id_mutation: "",
        date_mutation: new Date('2012-12-12'),
        nature_mutation: "",
        valeur_fonciere: 0,
        adresse_numero: 0,
        adresse_nom_voie: "",
        adresse_code_voie: "",
        code_postal: 0,
        code_commune: 0,
        nom_commune: "",
        code_departement: 0,
        nombre_lots: 0,
        type_local: "",
        surface_reelle_bati: 0,
        nombre_pieces_principales: 0,
        longitude: 0,
        latitude: 0
    } as Omit<Mutation, 'new_id_mutation'>)

    const [typeLocal, setTypeLocal] = useState(undefined as 'Appartement' | 'Maison' | undefined)

    return (
        <div className={'h-full'}>
            <AppBarComponent/>
            <div className={'w-full h-full pt-16 mx-auto border-b-blue-700 flex justify-center'}>
                <div className={'w-100 p-10'}>
                    {steps === 0 && <div className={'h-60'}>
                        <h1>What is the address of the property to be valued?</h1>
                        <form className={''}>
                            {/* This semantic dropdown may be considred as HTMLInputElement, with a value props
                            in order for the dropdown to display the selected value, we must use primitive types like string, number etc...
                            we can't use object as value, so we must convert the object to a string using JSON.stringify() and then parse it back to object using JSON.parse()
                            */}
                            <Dropdown icon='search'
                                      loading={false}
                                      style={{height: '40px'}}
                                      placeholder='Write an adress...'
                                      search
                                      selection
                                      className={'w-full'}
                                      closeOnChange
                                      value={selectedAddress}
                                      options={addressesSearchOptions} onChange={(e, {value}) => {
                                console.info(value)
                                setSelectedAddress(value)
                            }} onSearchChange={(e) => {
                                fetchAddresses((e.target as HTMLInputElement).value)
                            }}/>

                        </form>
                        <div className={'flex justify-center pt-10'}>
                            <Button onClick={() => setSteps((prev) => prev + 1)}
                                    disabled={_.isEmpty(addressesSearchOptions) || _.isEmpty(selectedAddress)}>Next</Button>
                        </div>
                    </div>}


                    {steps === 1 && <div className={'h-60'}>
                        <h1>What type of accommodation is it?</h1>
                        <div className={'flex justify-center mx-2'}>
                            <div onClick={() => setTypeLocal('Maison')}
                                 className={`flex flex-col items-center border-2 rounded w-80 p-10 hover:bg-gray-100 ${typeLocal === 'Maison' && 'border-2 border-blue-700 hover:bg-transparent'}`}>
                                <FontAwesomeIcon icon={faHouse} size={'4x'} fixedWidth color={'darkgray'}
                                                 className={`p-10 ${typeLocal === 'Maison' && 'text-blue-700'}`}/>
                                <div className={'flex justify-center'}>
                                    <p className={`text-gray-500 ${typeLocal === 'Maison' && 'text-blue-700'}`}>House</p>
                                </div>
                            </div>
                            <div className={'flex justify-center mx-2'}>
                                <div onClick={() => setTypeLocal('Appartement')}
                                     className={`flex flex-col items-center border-2 rounded w-80 p-10 hover:bg-gray-100 ${typeLocal === 'Appartement' && 'border-2 border-blue-700 hover:bg-transparent'}`}>
                                    <FontAwesomeIcon icon={faBuilding} size={'4x'} fixedWidth color={'darkgray'}
                                                     className={`p-10 ${typeLocal === 'Appartement' && 'text-blue-700'}`}
                                    />
                                    <div className={'flex justify-center'}>
                                        <p className={`text-gray-500 ${typeLocal === 'Appartement' && 'text-blue-700'}`}>Appartement</p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className={'flex justify-center pt-10'}>
                            <Button onClick={() => setSteps((prev) => prev - 1)}
                                    disabled={_.isEmpty(addressesSearchOptions) || _.isEmpty(selectedAddress)}>Previous</Button>
                            <Button onClick={() => setSteps((prev) => prev + 1)}
                                    disabled={_.isUndefined(typeLocal)}>Next</Button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}