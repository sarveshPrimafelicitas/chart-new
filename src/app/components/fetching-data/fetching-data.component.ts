import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { GraphQLClient } from 'graphql-request'; // GraphQL request client
var client: any = null;
import { gql } from 'graphql-request'; // graphql query language
import axios from 'axios'; // Requests
import { environment } from 'src/environments/environment';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';

declare var google: any;
const tokenStoreArray: any = [];

@Component({
  selector: 'app-fetching-data',
  templateUrl: './fetching-data.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: [
    './fetching-data.component.css',
    '../../../assets/css/fetchingData.css',
  ],
})
export class FetchingDataComponent implements OnInit {
  virtualidfound = true;
  journeynotfound = true;
  virtualidfoundmessages = false;
  virtual_string: any = '';
  resdata: any;
  tokenid = null;
  mainurl = '';
  // status: any = true;
  @ViewChild('myImage') myImage?: ElementRef<HTMLImageElement>;

  //varibales for performance
  passport_url = '';
  blockchain_id: any;
  materialdata = [];
  awareID: any;
  token: any = {};
  previous_tokens: any[] = [];
  total_production_quantity: number = 0;
  total_production_weight: number = 0;
  totalgram = 0;
  previous_aware_asset_composition: any = [];
  //  status: any = true;
  levelWiseTokensArray: any[][] = [];

  //varibales used in html for binding
  journey_load = false;
  receivedData: any;
  brockenURL = false;
  finalbrand: any = {};
  mainWebsite: any = null;
  miscellaneous: any = {};
  product_journey: any[] = [];
  composition_material: any = [];
  idesforprint: any;
  iotex_address: any = environment.iotex_address;
  baseaddress = environment.domain;

  website_base = environment.website_base;
  sustainable = 0;
  //new
  _awareid: any = null;

  constructor(public router: Router, private authservice: AuthServiceService) {}

  async ngOnInit(): Promise<void> {
    const tempBreak = this.router.url.split('/');
    console.log(tempBreak);

    const lastIndex = tempBreak[tempBreak.length - 1];

    const v1Found = lastIndex.split('-')[0];
    if (v1Found === 'v1') {
      this.authservice.findOldVirtualId(lastIndex).subscribe(
        (res: any) => {
          this.resdata = res;

          const baseUrl = tempBreak.slice(0, -1).join('/');

          console.log('baseaddress', this.baseaddress);

          this.mainurl = `${baseUrl}/${res._awareid}-${lastIndex}`;

          console.log('this.mainurl1', this.mainurl);
          if (res.status === true) {
            // this.virtualidfound = false;
            // this.virtualidfoundmessages = false;
            // this.tokenid = res.block_id;
            this.tokenid = res.block_id;
            sessionStorage.setItem('dppsetting', JSON.stringify(res));
            const steps = res?.dpp_settings?.journey_level?.journeystep || 4;
            // const arra =  steps.map(Number).sort((a:any, b:any) => a - b);
            sessionStorage.setItem('level', steps);
            this._awareid = res._awareid;

            this.getmaterial();

            this.navigate();
          } else {
            this.virtual_string = `${res.kyc_obj.company_name}-${res.products_line_details.order_number}-${res.products_line_details.item_number}-${res.products_line_details.color}`;
            this.virtualidfoundmessages = true;
            this.virtualidfound = true;
          }
        }
        // (ex) => {
        //   this.virtualidfoundmessages = true;
        //   this.virtualidfound = true;
        // }
      );
    } else {
      const segments = this.router.url.split('/');
      const lastSegment = segments[segments.length - 1];
      const splitString = lastSegment.split('-');
      const id = splitString[splitString.length - 1] || null;
      const poId = splitString[splitString.length - 2] || null;
      this._awareid = splitString[splitString.length - 3] || null;

      this.authservice.findVirtualId(id, this._awareid, poId).subscribe(
        (res: any) => {
          this.resdata = res;
          console.log(this.resdata);

          if (res.status === true) {
            this.tokenid = res.block_id;
            sessionStorage.setItem('dppsetting', JSON.stringify(res));
            const steps = res?.dpp_settings?.journey_level?.journeystep || 4;
            // const arra =  steps.map(Number).sort((a:any, b:any) => a - b);
            sessionStorage.setItem('level', steps);

            this.getmaterial();

            this.navigate();
          } else {
            this.virtual_string = `${res.kyc_obj.company_name}-${res.products_line_details.order_number}-${res.products_line_details.item_number}-${res.products_line_details.color}`;
            this.virtualidfoundmessages = true;
            this.virtualidfound = true;
            setTimeout(() => {
              this.journeynotfound = false;
            }, 10000);
          }
        }
        // (ex) => {
        //   console.error('An error occurred:', ex);
        //   this.virtualidfoundmessages = true;
        //   this.virtualidfound = true;
        // }
      );
      this.mainurl = this.router.url;
      console.log('mainurl2', this.mainurl);
    }
  }
  imgewidth() {
    const images: any = document.querySelectorAll('.productimg');
    images.forEach((img: any) => {
      // Get the container size or viewport size if needed
      const containerWidth: any = 290;
      const aspectRatio = img.naturalHeight / img.naturalWidth;
      const desiredHeight: any = containerWidth * aspectRatio;
      // Set the width attribute based on the container or viewport size
      img.setAttribute('width', containerWidth);
      img.setAttribute('height', desiredHeight); // Maintain aspect ratio
    });
  }
  ngAfterViewInit() {
    this.checkImageLoad();
  }

  onImageLoad() {
    // this.status = false;
  }

  onImageError() {
    // this.status = true;
  }

  private checkImageLoad() {
    const imgElement = this.myImage?.nativeElement;
    if (imgElement?.complete) {
      if (imgElement.naturalHeight !== 0) {
        // this.status = false;
      } else {
        // this.status = true;
      }
    }
  }

  redirecturl() {
    this.router.navigateByUrl(
      'http://192.168.68.139:4200/product-passport/aw_qrnwrt/fbindia-662cd83077871df79107e4bc-phn0jxzvf7cq96uuhgo5e0p2-910/iotex-bc'
    );
  }

  dppmenuopan() {
    const menu: any = document.getElementById('dppmenu');
    menu.classList.toggle('active');
  }

  async navigate() {
    const passport_url = this.mainurl;
    sessionStorage.setItem('passport_url', passport_url);

    const blockchain_id: any = this.tokenid;
    sessionStorage.setItem('blockchain_id', blockchain_id);

    const awareid = this._awareid;
    sessionStorage.setItem('awareid', awareid);

    const id = blockchain_id;
    client = new GraphQLClient(environment.sub_graph);

    // Fetch token and perform the two async operations in parallel
    const postPromise = getTokenByID(id);
    // const anotherUselessDataPromise = this.authservice
    //   .anotherUselessData(awareid)
    //   .toPromise();

    const anotherUselessData$ = this.authservice.anotherUselessData(awareid);
    const anotherUselessDataPromise = await lastValueFrom(anotherUselessData$);

    const post = await postPromise;
    console.log({ post });

    this.token = { ...post, other_material: false };

    const someUselessData$ = this.authservice.someUselessData(
      this.token.metadata.description
    );
    const someUselessDataPromise = await lastValueFrom(someUselessData$);
    // Run both API calls in parallel
    const [anotherUselessDataRes, someUselessDataRes] = await Promise.all([
      anotherUselessDataPromise,
      someUselessDataPromise,
    ]);

    // Handle the response of anotherUselessData
    this.finalbrand = anotherUselessDataRes.data || {};
    const website = anotherUselessDataRes.data.kyc_avaliable?.website || '';
    if (website) {
      this.mainWebsite =
        website.startsWith('http:') || website.startsWith('https:')
          ? website
          : `http://${website}/`;
    }

    // Handle the response of someUselessData
    const resData = someUselessDataRes.data;
    this.miscellaneous = resData;
    this.previous_tokens.push(this.token);

    // console.log("finalbrand", this.finalbrand)
    // console.log("miscellaneous", this.miscellaneous)

    const assetsAvailable = resData.assets_avaliable;
    this.total_production_quantity = Number(assetsAvailable.quantity);
    this.total_production_weight = Number(assetsAvailable.weight);
    this.totalgram =
      this.total_production_weight / this.total_production_quantity;
    // Iterate over compositionArrayMain and push the necessary data
    for (let i = 0; i < assetsAvailable.compositionArrayMain.length - 1; i++) {
      const ele = assetsAvailable.compositionArrayMain[i];
      const value = Number(ele.total_kgs) || 0;
      const compositionMaterial = ele.composition_material;
      const sustainabilityClaim = ele.sustainability_claim;
      const sustainable = ele.sustainable;
      const found: any = this.materialdata.find(
        (x: any) =>
          x.name === `${compositionMaterial} ${sustainabilityClaim}` ||
          x.name === `${compositionMaterial} Conventional`
      );
      // this.previous_tokens.push({
      //   'other_material': true,
      //   'material': sustainable
      //     ? `${sustainabilityClaim} ${compositionMaterial}`
      //     : `Conventional ${compositionMaterial}`,
      //   'value': value ? (value * 1000 / this.total_production_quantity) : 0,
      //   'tracer': resData?.tracer_avaliable?.aware_tc_checked,
      //   'sustainable': sustainable,
      //   'description': found?.description
      // }); old code

      this.previous_tokens.push({
        other_material: true,
        material: sustainable
          ? `${sustainabilityClaim} ${compositionMaterial}`
          : `${compositionMaterial}`,
        value: value ? (value * 1000) / this.total_production_quantity : 0,
        tracer: resData?.tracer_avaliable?.aware_tc_checked,
        sustainable: sustainable,
        description: found?.description,
      });
    }

    // Run getAwareAssetsData in parallel with other operations
    await Promise.all([
      this.getAwareAssetsData(resData?.assets_avaliable?.assetdataArrayMain),
      this.collectTokensLevelWise(post),
    ]);

    const sessionData = {
      previous_aware_asset_composition: this.previous_aware_asset_composition,
      materialdata: this.materialdata,
      total_production_quantity: this.total_production_quantity,
      total_production_weight: this.total_production_weight,
      totalgram: this.totalgram,
      miscellaneous: this.miscellaneous,
      mainWebsite: this.mainWebsite,
      token: this.token,
      previous_tokens: this.previous_tokens,
      product_journey: this.levelWiseTokensArray,
      composition_material: this.composition_material,
      sustainable: this.sustainable,
      finalbrand: this.finalbrand,
    };
    // Store session data and navigate
    sessionStorage.setItem('allSessionData', JSON.stringify(sessionData));
    this.virtualidfoundmessages = false;
    this.virtualidfound = false;

    this.router.navigate([`${this.mainurl}-${this.tokenid}/iotex-bc`]);
  }

  getmaterial() {
    this.authservice.getMetarialData().subscribe((res: any) => {
      this.materialdata = res.data.material_content;
    });
  }

  // async collectTokensLevelWise(tokenObject: any): Promise<void> {
  //   try {
  //     await this.pushTokens(tokenObject, 0);

  //     // console.log('Level-wise tokens collected:', this.levelWiseTokensArray);
  //     this.levelWiseTokensArray.forEach((journey: any[]) => {
  //       journey.forEach(async (token: any) => {
  //         const flattenedArray = this.levelWiseTokensArray.reduce((acc: any[], curr: any[]) => acc.concat(curr), []);

  //         const typesToHandle = ['Fabric', 'Fiber', 'Yarn', 'Pellet']; // Define types dynamically

  //         var internal_obj = flattenedArray.filter((obj: any) => {
  //           const assetDataArray = token?.additionalData?.data?.assets_avaliable?.assetdataArrayMain;
  //           console.log("assetDataArray",assetDataArray)
  //           if (!Array.isArray(assetDataArray)) {
  //             return false;
  //           }
  //           const mappedData = assetDataArray.map(x=> x.aware_token_type
  //           )
  //           console.log("mappedData",mappedData);
  //           return assetDataArray.some((x: any) => x.block_id === obj.id);
  //         });

  //         // Initialize a count object to track occurrences of each type
  //         const typeCount: any = {};

  //         // First pass: Count occurrences of each type
  //         token?.additionalData?.data?.assets_avaliable?.assetdataArrayMain?.forEach((obj: any) => {
  //           const currentType = obj.aware_token_type;
  //           if (typesToHandle.includes(currentType)) {
  //             typeCount[currentType] = (typeCount[currentType] || 0) + 1;
  //           }
  //         });

  //         // Second pass: Assign values to additionalInfo
  //         token?.additionalData?.data?.assets_avaliable?.assetdataArrayMain?.forEach((obj: any) => {
  //           const currentType = obj.aware_token_type;
  //           if (typesToHandle.includes(currentType)) {
  //             if (typeCount[currentType] > 1) {
  //               // If the type occurs more than once, assign a sequential number
  //               obj.index = token?.additionalData?.data?.assets_avaliable?.assetdataArrayMain?.filter((o: any) => o.aware_token_type === currentType).indexOf(obj) + 1;
  //             } else {
  //               // If the type occurs only once, assign null
  //               obj.index = null;
  //             }
  //           } else {
  //             obj.index = null; // Assign null for unhandled types
  //           }
  //         });

  //         token.internal_token = internal_obj.length > 0 ? internal_obj : null;

  //       });
  //     });

  //     console.log("this.levelWiseTokensArray", this.levelWiseTokensArray)

  //     // console.log("Updated levelWiseTokensArray", this.levelWiseTokensArray);
  //   } catch (error) {
  //     console.error('Error in collectTokensLevelWise:', error);
  //   }
  // }

  async collectTokensLevelWise(tokenObject: any): Promise<void> {
    try {
      await this.pushTokens(tokenObject, 0);

      // this.logger.downloadLogs();

      // Iterate over levelWiseTokensArray
      this.levelWiseTokensArray.forEach((journey: any[]) => {
        journey.forEach((token: any) => {
          const flattenedArray = this.levelWiseTokensArray.reduce(
            (acc: any[], curr: any[]) => acc.concat(curr),
            []
          );

          const typesToHandle = ['Fabric', 'Fiber', 'Yarn', 'Pellet']; // Define types dynamically

          // Create an object to track occurrences and type-based internal_obj filtering
          const typeCount: any = {};
          const internal_obj: any = [];

          // Single pass to count occurrences, filter internal_obj, and assign indices
          token?.additionalData?.data?.assets_avaliable?.assetdataArrayMain?.forEach(
            (obj: any) => {
              const currentType = obj.aware_token_type;

              // Check if the type should be handled
              if (typesToHandle.includes(currentType)) {
                // Count occurrences of each type
                typeCount[currentType] = (typeCount[currentType] || 0) + 1;

                // Filter the relevant objects for internal_obj based on block_id match
                const foundObj = flattenedArray.find(
                  (flatObj: any) => flatObj.id === obj.block_id
                );

                if (foundObj) {
                  internal_obj.push(foundObj);
                }
              }
            }
          );

          // Second pass to assign the index (optimized to avoid filter in loop)
          let typeIndexMap: any = {}; // Track the indices of each type

          token?.additionalData?.data?.assets_avaliable?.assetdataArrayMain?.forEach(
            (obj: any) => {
              const currentType = obj.aware_token_type;

              if (typesToHandle.includes(currentType)) {
                if (!typeIndexMap[currentType]) {
                  typeIndexMap[currentType] = 1; // Initialize sequential number
                }

                if (typeCount[currentType] > 1) {
                  obj.index = typeIndexMap[currentType]++;
                } else {
                  obj.index = null;
                }
              } else {
                obj.index = null; // Assign null for unhandled types
              }
            }
          );

          token.internal_token = internal_obj.length > 0 ? internal_obj : null;
        });
      });

      // console.log("this.levelWiseTokensArray", this.levelWiseTokensArray);
    } catch (error) {
      console.error('Error in collectTokensLevelWise:', error);
    }
  }

  isDuplicate(tokenType: string): boolean {
    const count =
      this.token.additionalData.data.assets_avaliable.assetdataArrayMain.filter(
        (material: any) => material.aware_token_type === tokenType
      ).length;
    return count > 1;
  }

  getDuplicateIndex(tokenType: string, currentIndex: number): number {
    const sameTokenMaterials =
      this.token.additionalData.data.assets_avaliable.assetdataArrayMain.filter(
        (material: any) => material.aware_token_type === tokenType
      );
    return (
      sameTokenMaterials.findIndex(
        (material: any) =>
          material ===
          this.token.additionalData.data.assets_avaliable.assetdataArrayMain[
            currentIndex
          ]
      ) + 1
    );
  }

  async pushTokens(obj: any, level: number) {
    if (!this.levelWiseTokensArray[level]) {
      this.levelWiseTokensArray[level] = [];
    }

    const tokenPromises: Promise<any>[] = [];
    // console.log(obj);

    const additionalData = await this.fetchAdditionalDataForToken(
      obj.id,
      obj.metadata.description
    ).toPromise();

    obj.additionalData = additionalData;

    try {
      // const result = await geocodeAddress(geocoder, obj.metadata.productionFacility);
      let geocoder = new google.maps.Geocoder();

      const result = await geocodeAddress(
        geocoder,
        obj.additionalData.data.kyc_avaliable.country
      );
      // Pass country from the KYC because some token productionFacility not avaible in the token confirm by Abhisheke

      obj.CountryISOCode = result;
    } catch (ex) {
      obj.CountryISOCode = null;
    }

    const assetsAvailableArray =
      obj.additionalData?.data?.assets_avaliable?.assetdataArrayMain || [];

    console.log('assetsAvailableArray', assetsAvailableArray);
    const previousTokenDetailArray = obj.metadata?.previousTokenDetail || [];

    // Process assets available
    for (const x of assetsAvailableArray) {
      // console.log(x);

      x.icon =
        x.aware_token_type === 'Yarn'
          ? 'assets/materialicons/yarn.svg'
          : x.aware_token_type === 'Fabric'
          ? 'assets/materialicons/febric.svg'
          : x.aware_token_type === 'Fiber'
          ? 'assets/materialicons/fiber.svg'
          : x.aware_token_type === 'Pellet'
          ? 'assets/materialicons/fiber.svg'
          : 'assets/materialicons/other.svg';
    }

    const compositionArrayMain =
      obj.additionalData?.data?.assets_avaliable?.compositionArrayMain || [];
    for (const x of compositionArrayMain) {
      const materialname =
        x.composition_material +
        ' ' +
        (x.sustainable === true ? x.sustainability_claim : 'conventional');
      // console.log(x, materialname.toLowerCase());

      if (materialname.toLowerCase() == 'cotton conventional') {
        x.icon = 'assets/materialicons/cotton-conventional.png';
      } else if (
        materialname.toLowerCase() == 'cotton organic' ||
        materialname.toLowerCase() == 'cotton regenerative' ||
        materialname.toLowerCase() == 'cotton better'
      ) {
        x.icon = 'assets/materialicons/cotton-green.png';
      } else if (materialname.toLowerCase() == 'cotton recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      }
      //  polyester
      else if (materialname.toLowerCase() == 'polyester conventional') {
        x.icon = 'assets/materialicons/polyester-conventional.png';
      } else if (materialname.toLowerCase() == 'polyester recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (materialname.toLowerCase() == 'polyester biobased') {
        x.icon = 'assets/materialicons/polyester-biobased.png';
      }
      // Cellulosics
      else if (materialname.toLowerCase() == 'cellulosics conventional') {
        x.icon = 'assets/materialicons/cellulosics-conventional.png';
      } else if (materialname.toLowerCase() == 'cellulosics recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (
        materialname.toLowerCase() == 'cellulosics lyocell' ||
        materialname.toLowerCase() == 'cellulosics modal' ||
        materialname.toLowerCase() == 'cellulosics viscose'
      ) {
        x.icon = 'assets/materialicons/cellulosics-green.png';
      }
      // Acrylic
      else if (materialname.toLowerCase() == 'acrylic conventional') {
        x.icon = 'assets/materialicons/acrylic-conventional.png';
      } else if (materialname.toLowerCase() == 'acrylic recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      }
      // Bamboo
      else if (materialname.toLowerCase() == 'bamboo conventional') {
        x.icon = 'assets/materialicons/bamboo-conventional.png';
      } else if (
        materialname.toLowerCase() == 'bamboo fsc' ||
        materialname.toLowerCase() == 'bamboo organic'
      ) {
        x.icon = 'assets/materialicons/bamboo-green.png';
      }
      // Cashmere
      else if (materialname.toLowerCase() == 'cashmere conventional') {
        x.icon = 'assets/materialicons/cashmere-conventional.png';
      } else if (materialname.toLowerCase() == 'cashmere recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (
        materialname.toLowerCase() == 'cashmere responsible / regenerative'
      ) {
        x.icon = 'assets/materialicons/cashmere-green.png';
      }
      // Elastane
      else if (materialname.toLowerCase() == 'elastane conventional') {
        x.icon = 'assets/materialicons/elastane-conventional.png';
      }
      // Hemp
      else if (materialname.toLowerCase() == 'hemp conventional') {
        x.icon = 'assets/materialicons/hemp-conventional.png';
      } else if (
        materialname.toLowerCase() == 'hemp organic' ||
        materialname.toLowerCase() == 'hemp better'
      ) {
        x.icon = 'assets/materialicons/hemp-green.png';
      }
      // Leather
      else if (materialname.toLowerCase() == 'leather conventional') {
        x.icon = 'assets/materialicons/leather-conventional.png';
      } else if (materialname.toLowerCase() == 'leather recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (materialname.toLowerCase() == 'leather better') {
        x.icon = 'assets/materialicons/leather-green.png';
      }
      // Nylon
      else if (materialname.toLowerCase() == 'nylon conventional') {
        x.icon = 'assets/materialicons/nylon-conventional.png';
      } else if (materialname.toLowerCase() == 'nylon recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      }
      // Polyurethane
      else if (materialname.toLowerCase() == 'polyurethane conventional') {
        x.icon = 'assets/materialicons/polyurethane-conventional.png';
      } else if (materialname.toLowerCase() == 'polyurethane recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (materialname.toLowerCase() == 'polyurethane plant based') {
        x.icon = 'assets/materialicons/polyurethane-plantbased.png';
      }
      // Wool
      else if (materialname.toLowerCase() == 'wool conventional') {
        x.icon = 'assets/materialicons/wool-conventional.png';
      } else if (materialname.toLowerCase() == 'wool recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (
        materialname.toLowerCase() == 'wool responsible / regenerative'
      ) {
        x.icon = 'assets/materialicons/wool-green.png';
      }
      // Agricultural Res
      else if (materialname.toLowerCase() == 'agricultural res conventional') {
        x.icon = 'assets/materialicons/agricultural-res.png';
      }
      // Down
      else if (materialname.toLowerCase() == 'down conventional') {
        x.icon = 'assets/materialicons/down-conventional.png';
      } else if (materialname.toLowerCase() == 'down recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (materialname.toLowerCase() == 'down responsible') {
        x.icon = 'assets/materialicons/down-responsible.png';
      }
      // Elastomultiester
      else if (materialname.toLowerCase() == 'elastomultiester conventional') {
        x.icon = 'assets/materialicons/elastomultiester-conventional.png';
      } else if (materialname.toLowerCase() == 'elastomultiester recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      }
      // Linen
      else if (materialname.toLowerCase() == 'linen conventional') {
        x.icon = 'assets/materialicons/Linen-conventional.png';
      } else if (materialname.toLowerCase() == 'linen recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (materialname.toLowerCase() == 'linen organic') {
        x.icon = 'assets/materialicons/linen-organic.png';
      }
      // Mohair
      else if (materialname.toLowerCase() == 'mohair conventional') {
        x.icon = 'assets/materialicons/mohair-conventional.png';
      } else if (materialname.toLowerCase() == 'mohair recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (
        materialname.toLowerCase() == 'mohair responsible / regenerative'
      ) {
        x.icon = 'assets/materialicons/mohair-green.png';
      }
      //  Silk
      else if (materialname.toLowerCase() == 'silk conventional') {
        x.icon = 'assets/materialicons/silk-conventional.png';
      } else if (materialname.toLowerCase() == 'silk recycled') {
        x.icon = 'assets/materialicons/recynled-green.png';
      } else if (materialname.toLowerCase() == 'silk organic') {
        x.icon = 'assets/materialicons/silk-organic.png';
      }
      // other
      else {
        x.icon = 'assets/materialicons/other.svg';
      }
    }

    if (assetsAvailableArray.length === previousTokenDetailArray.length) {
      for (let i = 0; i < assetsAvailableArray.length; i++) {
        assetsAvailableArray[i].block_id = previousTokenDetailArray[i];
      }
    } else {
      console.error('Arrays have different lengths.');
    }

    const chemicalComplianceCertificates =
      obj.additionalData?.data?.kyc_avaliable
        ?.chemical_compliance_certificates || [];
    for (const x of chemicalComplianceCertificates) {
      x.icon =
        x === 'None'
          ? null
          : `assets/images/factory_compliance/${x.documentname.replace(
              /[^a-zA-Z0-9]+/g,
              ''
            )}.png`;
    }

    const environmentalScopeCertificates =
      obj.additionalData?.data?.kyc_avaliable
        ?.environmental_scope_certificates || [];
    for (const x of environmentalScopeCertificates) {
      x.icon =
        x === 'None'
          ? null
          : `assets/images/factory_compliance/${x.documentname.replace(
              /[^a-zA-Z0-9]+/g,
              ''
            )}.png`;
    }

    const socialComplianceCertificates =
      obj.additionalData?.data?.kyc_avaliable?.social_compliance_certificates ||
      [];
    for (const x of socialComplianceCertificates) {
      x.icon =
        x === 'None'
          ? null
          : `assets/images/factory_compliance/${x.documentname.replace(
              /[^a-zA-Z0-9]+/g,
              ''
            )}.png`;
    }

    this.levelWiseTokensArray[level].push(obj);

    if (obj.metadata && Array.isArray(obj.metadata.previousTokenDetail)) {
      const tokenPromises = obj.metadata.previousTokenDetail.map(
        async (id: string) => {
          const token = await getTokenByID(id);
          // console.log(token);

          if (token) {
            await this.pushTokens(token, level + 1);
          }
        }
      );

      // Wait for all promises to complete
      await Promise.all(tokenPromises);
    }
  }

  fetchAdditionalDataForToken(tokenId: string, description: string) {
    return this.authservice.someUselessData(description);
  }

  async getAwareAssetsData(data: any) {
    // console.log("data",data)
    this.authservice.getAwareAssetDataRequest(data).subscribe(
      (res: any) => {
        this.previous_aware_asset_composition = res.data;
        // console.log("this.previous_aware_asset_composition", this.previous_aware_asset_composition);

        // Process previous aware asset composition
        for (let i = 0; i < this.previous_aware_asset_composition.length; i++) {
          const ele = this.previous_aware_asset_composition[i];
          const single = this.previous_aware_asset_composition.length === 1;
          this.processCompositionElement(ele, true, single);
        }

        // Process miscellaneous assets available composition
        const compArrayMain =
          this.miscellaneous?.assets_avaliable?.compositionArrayMain;
        if (compArrayMain && compArrayMain.length > 0) {
          for (let i = 0; i < compArrayMain.length; i++) {
            const ele = compArrayMain[i];
            const single = compArrayMain.length === 1;
            this.processCompositionElement(ele, false, single);
          }
        }

        function isKeyInAllObjects(array: any[], key: string): boolean {
          return array.every((obj) => key in obj);
        }

        const keyExists = isKeyInAllObjects(
          this.composition_material,
          'percentage'
        );
        // console.log({ keyExists });

        if (keyExists) {
          for (let i = 0; i < this.composition_material.length; i++) {
            const ele = this.composition_material[i];
            ele.value_in_percentage = ele.value;

            //zuber bug
            // ele.value_in_percentage = (ele.value / this.total_production_weight) * 100;

            if (ele.sustainable) {
              this.sustainable += ele.value;
            }
            // console.log(this.sustainable);
          }
        } else {
          function formatValue(value: number): number {
            // console.log({value})
            return value % 1 !== 0
              ? Number(value.toFixed(2))
              : Number(value.toString());
          }

          for (let i = 0; i < this.composition_material.length; i++) {
            const ele = this.composition_material[i];
            // const value_in_percentage = ele.percentage ? ele.value : (ele.value / Number(this.total_production_weight)) * 100;

            //bug fix
            ele.value_in_percentage = formatValue(ele.value);

            if (ele.sustainable) {
              this.sustainable += ele.value_in_percentage;
            }
            // console.log(this.sustainable);
          }
        }
      }
      // (ex) => {
      //   console.log({ ex });
      // }
    );
  }

  async processCompositionElement(
    ele: any,
    isPreviousAwareAsset: boolean,
    single: boolean
  ): Promise<void> {
    const compositionMaterial = ele?.composition_material;
    const sustainabilityClaim = ele?.sustainability_claim;
    const sustainable = ele?.sustainable;
    console.log('de3epak33', compositionMaterial);

    let value = 0;
    let total_weight = 0;
    let value_From_inner_materials = 0;

    // console.log("ele", ele);
    // console.log("single", single);
    // console.log("isPreviousAwareAsset", isPreviousAwareAsset);

    if (single) {
      // value = ele?.total_kgs ? Number(ele?.total_kgs) : 0;
      // total_weight = ele?.used_token ? Number(ele?.used_token) : 0;
      value = ele?.total_kgs
        ? (Number(ele?.total_kgs) / this.total_production_weight) * 100
        : 0;

      //clinet bug fixed, if didn't work then remove this and uncomment the above
      total_weight = ele?.used_token
        ? (Number(ele?.used_token) / this.total_production_weight) * 100
        : 0;
    } else {
      // value = ele?.total_kgs ? (Number(ele?.total_kgs) * 1000 / this.total_production_quantity) : 0;

      value = ele?.total_kgs
        ? (Number(ele?.total_kgs) / this.total_production_weight) * 100
        : 0;

      total_weight = ele?.used_token
        ? (Number(ele?.used_token) / this.total_production_weight) * 100
        : 0;
    }

    value_From_inner_materials = total_weight
      ? (total_weight * Number(ele?.percentage)) / 100
      : 0;
    // console.log({ value, total_weight, value_From_inner_materials });

    const found: any =
      this.materialdata.find(
        (x: any) => x.name === `${compositionMaterial} ${sustainabilityClaim}`
      ) ||
      this.materialdata.find(
        (x: any) => x.name === `${compositionMaterial} Conventional`
      );

    // console.log("ele", ele);

    // console.log("composition_material", this.composition_material)

    const elementToUpdate = this.composition_material.find(
      (item: any) =>
        item.composition_material === ele?.composition_material &&
        item.feedstock_recycled_materials ===
          ele?.feedstock_recycled_materials &&
        item.sustainability_claim === ele?.sustainability_claim &&
        item.sustainable === ele?.sustainable
    );

    // console.log("elementToUpdate", elementToUpdate);

    if (elementToUpdate) {
      elementToUpdate.value += value || value_From_inner_materials;

      if (isPreviousAwareAsset) {
        elementToUpdate.tracer =
          elementToUpdate.tracer ||
          (ele.total_kgs || ele.tracer
            ? this.miscellaneous?.tracer_avaliable?.aware_tc_checked
            : undefined);
      }
    } else {
      this.composition_material.push({
        ...ele,
        // 'material': sustainable ? `${sustainabilityClaim} ${compositionMaterial}` : `Conventional ${compositionMaterial}`, remove  Conventional

        material: sustainable
          ? `${sustainabilityClaim} ${compositionMaterial}`
          : `${compositionMaterial}`,
        value: ele.total_kgs ? value : value_From_inner_materials,
        description: found?.description,
      });
    }

    // console.log("composition_material", JSON.stringify(this.composition_material));
  }
}

async function getTokenByID(id: any) {
  // Collect Token
  let token = await client.request(AWARE_TOKEN_BY_ID(id));
  token = token.awareToken;

  console.log(token);
  if (token) {
    // Collect post metadata
    // const metadata = await axios.get(token.metadataURI);
    // console.log('metadata', metadata);

    // const updatedURI = token.metadataURI.replace("https://storageapi.fleek.co", "https://storage.wearaware.co");
    const updatedURI = token.metadataURI.includes('https://storageapi.fleek.co')
      ? token.metadataURI.replace(
          'https://storageapi.fleek.co',
          'https://storage.wearaware.co'
        )
      : token.metadataURI;
    const metadata = await axios.get(updatedURI);

    token.metadata = metadata.data;
    tokenStoreArray.push(token);
    console.log('token.metadata', token.metadata);
    // Only show Pebble posts
    if (token.metadata.version !== 'aware-20221012') {
      return undefined;
    }
    console.log('token.metadata.version', token.metadata.version);
  }
  // Return token
  return token;
}

function AWARE_TOKEN_BY_ID(id: any) {
  return gql`
  {
    awareToken(id:"${id.toString()}") {
      id,
      owner {
        id
      },
      creator {
        id
      },
      contentURI,
      metadataURI,
      amount,
      createdAtTimestamp
    }
  }
  `;
}

async function geocodeAddress(geocoder: any, address: string) {
  // console.log("address", address)
  return new Promise<any>((resolve, reject) => {
    geocoder.geocode(
      { address: address },
      (
        results: {
          address_components: any;
          geometry: { location: any }[];
        }[],
        status: string
      ) => {
        if (status === 'OK') {
          const addressComponents = results[0].address_components;

          // console.log("addressComponents", addressComponents)

          for (const component of addressComponents) {
            if (component.types.includes('country')) {
              // Return the country code (e.g., 'US', 'GB')
              resolve(component.short_name);
            }
          }

          reject(new Error(`Geocoding failed`));
        } else {
          reject(new Error(`Geocoding failed with status: ${status}`));
        }
      }
    );
  });
}
